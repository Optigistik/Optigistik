import traceback
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

app = FastAPI(title="Optigistik Solveur OR-Tools", version="2.0")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Le solveur d'optimisation logistique est en ligne."}


# ==========================================
# MODÈLES D'ENTRÉE
# ==========================================

class TimeWindow(BaseModel):
    start: int
    end: int

class PointInput(BaseModel):
    id: str
    role: str
    address: str
    demand: int
    service_time: int
    time_window: Optional[TimeWindow] = None

class VehicleInput(BaseModel):
    id: str
    name: str
    plate: str
    capacity: int
    driver_id: str
    driver_name: str

class SolveRequest(BaseModel):
    session_id: str
    points: List[PointInput]
    duration_matrix: List[List[float]]
    distance_matrix: List[List[float]]
    vehicles: List[VehicleInput]
    shift_start: int = 28800


# ==========================================
# UTILITAIRES
# ==========================================

def seconds_to_hhmm(seconds: int) -> str:
    h, rem = divmod(max(0, int(seconds)), 3600)
    m = rem // 60
    return f"{h:02d}:{m:02d}"

def is_night_shift(points: List[PointInput]) -> bool:
    for p in points:
        if p.role == "delivery" and p.time_window:
            if p.time_window.start < 18000 or p.time_window.end > 79200:
                return True
    return False


# ==========================================
# SOLVEUR OR-TOOLS
# ==========================================

@app.post("/api/optimize")
def optimize_route(request: SolveRequest):
    try:
        points = request.points
        vehicles = request.vehicles
        n = len(points)
        num_vehicles = len(vehicles)
        shift_start = request.shift_start

        if num_vehicles == 0:
            raise HTTPException(status_code=400, detail="Aucun véhicule disponible.")
        if n < 3:
            raise HTTPException(status_code=400, detail="Minimum 3 points requis.")

        depot_start_idx = 0
        depot_end_idx = n - 1

        night = is_night_shift(points)
        max_service_seconds = 36000 if night else 43200

        duration_matrix = [[int(v) for v in row] for row in request.duration_matrix]
        distance_matrix = [[int(v) for v in row] for row in request.distance_matrix]

        demands = [p.demand for p in points]
        service_times = [p.service_time for p in points]
        capacities = [max(1, v.capacity) for v in vehicles]

        time_windows = []
        for p in points:
            if p.role in ("origin", "end"):
                time_windows.append((shift_start, shift_start + max_service_seconds))
            elif p.time_window:
                time_windows.append((p.time_window.start, p.time_window.end))
            else:
                time_windows.append((shift_start, shift_start + max_service_seconds))

        starts = [depot_start_idx] * num_vehicles
        ends = [depot_end_idx] * num_vehicles

        manager = pywrapcp.RoutingIndexManager(n, num_vehicles, starts, ends)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            i = manager.IndexToNode(from_index)
            j = manager.IndexToNode(to_index)
            return distance_matrix[i][j]

        dist_cb_idx = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(dist_cb_idx)

        def demand_callback(from_index):
            return demands[manager.IndexToNode(from_index)]

        demand_cb_idx = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_cb_idx, 0, capacities, True, 'Capacity'
        )

        def time_callback(from_index, to_index):
            i = manager.IndexToNode(from_index)
            j = manager.IndexToNode(to_index)
            return duration_matrix[i][j] + service_times[i]

        time_cb_idx = routing.RegisterTransitCallback(time_callback)
        routing.AddDimensionWithVehicleCapacity(
            time_cb_idx,
            3600,
            [max_service_seconds] * num_vehicles,
            False,
            'Time'
        )
        time_dimension = routing.GetDimensionOrDie('Time')

        for idx, (tw_start, tw_end) in enumerate(time_windows):
            index = manager.NodeToIndex(idx)
            time_dimension.CumulVar(index).SetRange(tw_start, tw_end)

        for v in range(num_vehicles):
            start_index = routing.Start(v)
            time_dimension.CumulVar(start_index).SetMin(shift_start)

        penalty = 1_000_000
        for idx, p in enumerate(points):
            if p.role == "delivery":
                routing.AddDisjunction([manager.NodeToIndex(idx)], penalty)

        search_params = pywrapcp.DefaultRoutingSearchParameters()
        search_params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        search_params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        search_params.time_limit.FromSeconds(30)

        solution = routing.SolveWithParameters(search_params)

        if not solution:
            raise HTTPException(status_code=400, detail="Aucune solution trouvée (contraintes trop strictes).")

        # Extraction de la solution
        unperformed_ids = []
        for node in range(routing.Size()):
            if routing.IsStart(node) or routing.IsEnd(node):
                continue
            if solution.Value(routing.NextVar(node)) == node:
                node_idx = manager.IndexToNode(node)
                if 0 <= node_idx < len(points):
                    unperformed_ids.append(points[node_idx].id)

        result_vehicles = []
        total_distance_m = 0
        total_service_minutes = 0

        for v in range(num_vehicles):
            index = routing.Start(v)
            route_steps = []
            route_distance_m = 0
            current_load = sum(demands)

            while not routing.IsEnd(index):
                node_idx = manager.IndexToNode(index)
                point = points[node_idx]
                time_var = time_dimension.CumulVar(index)
                arrival_s = solution.Min(time_var)

                if point.role == "origin":
                    departure_s = arrival_s + point.service_time
                    route_steps.append({
                        "stop_type": "DEPOT_START",
                        "address": point.address,
                        "arrival_time": seconds_to_hhmm(arrival_s),
                        "departure_time": seconds_to_hhmm(departure_s),
                        "load_after_stop": current_load,
                    })
                elif point.role == "delivery":
                    departure_s = arrival_s + point.service_time
                    current_load -= point.demand
                    route_steps.append({
                        "stop_type": "DELIVERY",
                        "client_id": point.id,
                        "address": point.address,
                        "arrival_time": seconds_to_hhmm(arrival_s),
                        "departure_time": seconds_to_hhmm(departure_s),
                        "pallets_delivered": point.demand,
                        "load_after_stop": max(0, current_load),
                    })

                next_index = solution.Value(routing.NextVar(index))
                route_distance_m += routing.GetArcCostForVehicle(index, next_index, v)
                index = next_index

            # DEPOT_END
            node_idx = manager.IndexToNode(index)
            point = points[node_idx]
            time_var = time_dimension.CumulVar(index)
            arrival_s = solution.Min(time_var)
            route_steps.append({
                "stop_type": "DEPOT_END",
                "address": point.address,
                "arrival_time": seconds_to_hhmm(arrival_s),
            })

            deliveries_in_route = [s for s in route_steps if s["stop_type"] == "DELIVERY"]
            if not deliveries_in_route:
                continue

            working_minutes = (arrival_s - shift_start) // 60
            total_distance_m += route_distance_m
            total_service_minutes += working_minutes

            result_vehicles.append({
                "vehicle_id": vehicles[v].id,
                "vehicle_name": vehicles[v].name,
                "plate": vehicles[v].plate,
                "driver_id": vehicles[v].driver_id,
                "driver_name": vehicles[v].driver_name,
                "route": route_steps,
                "metrics": {
                    "total_distance_km": round(route_distance_m / 1000, 2),
                    "working_duration_minutes": working_minutes,
                }
            })

        return {
            "status": "success",
            "session_id": request.session_id,
            "night_shift": night,
            "summary": {
                "total_distance_km": round(total_distance_m / 1000, 2),
                "total_service_time_minutes": total_service_minutes,
                "unperformed_nodes": unperformed_ids,
            },
            "vehicles": result_vehicles,
        }

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur interne du solveur: {str(e)}")
