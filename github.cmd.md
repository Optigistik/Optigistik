gh pr create --title "ticketJIRA" --body "Description de mes changements" --reviewer "@axerito10"


## Suivre ses PR en cours
gh pr status

## Suivre toutes les PR
gh pr list

## Valider une PR
gh pr review IDDeLaPR --approve --body "Le code est propre, bien joué ! KAN-140 validé."

## Refuser une PR
gh pr review IDDeLaPR --comment --body "Il manque un test unitaire sur la fonction login."
gh pr review IDDeLaPR --request-changes --body "Merci de renommer cette variable pour plus de clarté."