'use server';

import { Resend } from 'resend';

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const siret = formData.get('siret') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !siret || !email || !message) {
        return { success: false, error: 'Tous les champs sont requis.' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Optigistik Contact <onboarding@resend.dev>', // Use default testing domain or verified domain
            to: ['optigistik@gmail.com'],
            subject: `Nouveau message de contact de ${name}`,
            html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>SIRET:</strong> ${siret}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: `Erreur Resend: ${error.message}` };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        if (error instanceof Error) {
            return { success: false, error: `Erreur technique: ${error.message}` };
        }
        return { success: false, error: 'Une erreur est survenue lors de l\'envoi du message.' };
    }
}

export async function sendQuoteRequestEmail(formData: FormData) {
    const companyName = formData.get('companyName') as string;
    const contactName = formData.get('contactName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const fleetSize = formData.get('fleetSize') as string;
    const sector = formData.get('sector') as string;
    const needs = formData.get('needs') as string;

    if (!companyName || !contactName || !email || !phone || !fleetSize || !sector) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Optigistik Devis <onboarding@resend.dev>',
            to: ['optigistik@gmail.com'],
            subject: `Nouvelle demande de devis : ${companyName}`,
            html: `
        <h3>Nouvelle demande de devis</h3>
        <hr />
        <h4>Informations Contact</h4>
        <p><strong>Entreprise:</strong> ${companyName}</p>
        <p><strong>Contact:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        
        <h4>Détails Opérationnels</h4>
        <p><strong>Taille de la flotte:</strong> ${fleetSize}</p>
        <p><strong>Secteur:</strong> ${sector}</p>
        
        <h4>Besoins</h4>
        <p>${needs ? needs.replace(/\n/g, '<br>') : 'Non spécifié'}</p>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: `Erreur Resend: ${error.message}` };
        }

        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        if (error instanceof Error) {
            return { success: false, error: `Erreur technique: ${error.message}` };
        }
        return { success: false, error: 'Une erreur est survenue lors de l\'envoi de la demande.' };
    }
}
