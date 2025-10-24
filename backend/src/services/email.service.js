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

// Enviar email sobre brindes disponíveis
export const enviarEmailBrindesDisponiveis = async (brindes) => {
    try {
        // Buscar todos os apoiadores ativos
        const Usuario = (await import('../models/Usuario.model.js')).default;
        const apoiadores = await Usuario.find({ papel: 'doador', ativo: true });

        if (apoiadores.length === 0) {
            console.log('Nenhum apoiador ativo para enviar email');
            return { success: 0, failed: 0 };
        }

        // Gerar lista HTML de brindes
        const brindesHtml = brindes.map(brinde => `
            <div style="margin: 20px 0; padding: 15px; background: #f7fafc; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${brinde.nome}</h3>
                <p style="margin: 0; color: #555; line-height: 1.5;">${brinde.descricao}</p>
            </div>
        `).join('');

        const subject = '🎁 Novos Brindes Disponíveis para Resgate!';
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #667eea; margin: 0;">Patas Solidárias</h1>
                    <p style="color: #666; margin: 10px 0 0 0;">Novidades para você! 🎉</p>
                </div>

                <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Olá, <strong>{{nome}}</strong>!
                    </p>
                    
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Temos ótimas notícias! Novos brindes estão disponíveis para resgate. 
                        Confira abaixo quais são:
                    </p>

                    ${brindesHtml}

                    <p style="font-size: 16px; color: #333; line-height: 1.6; margin-top: 30px;">
                        Acesse sua conta para solicitar o resgate do brinde que mais te agrada!
                    </p>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL}/meus-brindes" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; 
                                  font-weight: bold; font-size: 16px;">
                            Ver Brindes Disponíveis
                        </a>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px; color: #999; font-size: 14px;">
                    <p>Obrigado por apoiar as Patas Solidárias! 🐾❤️</p>
                </div>
            </div>
        `;

        const results = await sendBulkEmail(apoiadores, { subject, html });

        console.log(`📧 Emails de brindes enviados: ${results.success} sucesso, ${results.failed} falhas`);
        return results;
    } catch (error) {
        console.error('❌ Erro ao enviar emails de brindes:', error);
        throw error;
    }
};
