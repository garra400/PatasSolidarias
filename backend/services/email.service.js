import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço (outlook, yahoo, etc)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️  Erro na configuração do email:', error.message);
    console.log('   Configure EMAIL_USER e EMAIL_PASSWORD no arquivo .env');
  } else {
    console.log('✅ Servidor de email pronto para enviar mensagens');
  }
});

// Enviar email de confirmação de registro
export async function sendRegistrationEmail(userEmail, userName, confirmationToken) {
  const confirmationLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/confirmar-email?token=${confirmationToken}`;
  
  const mailOptions = {
    from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🐾 Confirme seu cadastro - Patas Solidárias',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
          <p style="color: white; margin: 10px 0 0 0;">Cuidando dos animais da UTFPR-MD com amor e dedicação</p>
        </div>
        
        <div style="padding: 30px; background-color: #f5f5f5;">
          <h2 style="color: #333;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Bem-vindo(a) ao <strong>Patas Solidárias</strong>! Estamos muito felizes em ter você conosco.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Para ativar sua conta e começar a ajudar nossos amiguinhos, clique no botão abaixo:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-size: 16px;
                      font-weight: bold;
                      display: inline-block;">
              Confirmar Cadastro
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="${confirmationLink}" style="color: #667eea;">${confirmationLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #777; font-size: 13px;">
            Se você não se cadastrou no Patas Solidárias, por favor ignore este email.
          </p>
        </div>
        
        <div style="background-color: #2196F3; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmação enviado para:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
}

// Enviar email de recuperação de senha
export async function sendPasswordResetEmail(userEmail, userName, resetToken) {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/redefinir-senha?token=${resetToken}`;
  
  const mailOptions = {
    from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '🔐 Recuperação de Senha - Patas Solidárias',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
          <p style="color: white; margin: 10px 0 0 0;">Recuperação de Senha</p>
        </div>
        
        <div style="padding: 30px; background-color: #f5f5f5;">
          <h2 style="color: #333;">Olá, ${userName}! 👋</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Patas Solidárias</strong>.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-size: 16px;
                      font-weight: bold;
                      display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="${resetLink}" style="color: #667eea;">${resetLink}</a>
          </p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Importante:</strong> Este link expira em 1 hora por segurança.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #777; font-size: 13px;">
            Se você não solicitou a recuperação de senha, por favor ignore este email. 
            Sua senha permanecerá a mesma.
          </p>
        </div>
        
        <div style="background-color: #2196F3; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de recuperação enviado para:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
}

export default transporter;
