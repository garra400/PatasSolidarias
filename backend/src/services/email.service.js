import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true para 465, false para outros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Carregar template HTML
const loadTemplate = async (templateName) => {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    try {
        return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
        console.error(`Template ${templateName} não encontrado`);
        return null;
    }
};

// Substituir variáveis no template
const replaceVariables = (template, context) => {
    let result = template;
    for (const [key, value] of Object.entries(context)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
};

// Enviar email
export const sendEmail = async ({ to, subject, template, context = {}, html, text }) => {
    try {
        let htmlContent = html;

        // Se foi especificado um template, carregar e processar
        if (template) {
            const templateContent = await loadTemplate(template);
            if (templateContent) {
                htmlContent = replaceVariables(templateContent, context);
            }
        }

        const mailOptions = {
            from: `Patas Solidárias <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw error;
    }
};

// Enviar email para múltiplos destinatários (Newsletter)
export const sendBulkEmail = async (recipients, { subject, html, text }) => {
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    for (const recipient of recipients) {
        try {
            await sendEmail({
                to: recipient.email,
                subject,
                html: html.replace('{{nome}}', recipient.nome),
                text
            });
            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({
                email: recipient.email,
                error: error.message
            });
        }
    }

    return results;
};
