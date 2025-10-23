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

// Enviar email de novas fotos adicionadas
export async function enviarEmailNovasFotos(fotos) {
  try {
    // Buscar todos os usuários com email verificado
    const { default: User } = await import('../models/user.model.js');
    const usuarios = await User.find({ emailVerificado: true }).select('email nome');

    if (usuarios.length === 0) {
      console.log('⚠️  Nenhum usuário para enviar email de novas fotos');
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    const mailOptions = {
      from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
      subject: '📸 Novas fotos dos patinhas! - Patas Solidárias',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
            <p style="color: white; margin: 10px 0 0 0;">Novas Fotos Disponíveis!</p>
          </div>
          
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Olá! 👋</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Temos novidades! ${fotos.length} nova(s) foto(s) dos nossos patinhas foram adicionadas à galeria! 📸
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Veja os momentos especiais dos nossos amiguinhos e acompanhe como eles estão.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/galeria" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px;
                        font-weight: bold;
                        display: inline-block;">
                Ver Galeria de Fotos
              </a>
            </div>
          </div>
          
          <div style="background-color: #2196F3; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
            </p>
          </div>
        </div>
      `
    };

    // Enviar para todos os usuários
    for (const usuario of usuarios) {
      await transporter.sendMail({ ...mailOptions, to: usuario.email });
    }

    console.log(`✅ Email de novas fotos enviado para ${usuarios.length} usuário(s)`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de novas fotos:', error);
    throw error;
  }
}

// Enviar email de brindes atualizados
export async function enviarEmailBrindesAtualizados(brindes) {
  try {
    const { default: User } = await import('../models/user.model.js');
    const apoiadores = await User.find({
      isDoador: true,
      emailVerificado: true
    }).select('email nome');

    if (apoiadores.length === 0) {
      console.log('⚠️  Nenhum apoiador para enviar email de brindes');
      return;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    const brindesHtml = brindes.map(brinde => `
      <div style="margin: 10px 0; padding: 10px; background-color: white; border-radius: 5px;">
        <strong>🎁 ${brinde.nome}</strong>
      </div>
    `).join('');

    const mailOptions = {
      from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
      subject: '🎁 Brindes atualizados! - Patas Solidárias',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
            <p style="color: white; margin: 10px 0 0 0;">Brindes Disponíveis!</p>
          </div>
          
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Olá, Apoiador! 👋</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Os brindes disponíveis para resgate foram atualizados! Confira o que está disponível:
            </p>
            
            ${brindesHtml}
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              Acesse sua conta para solicitar o resgate do seu brinde.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/conta/brindes" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px;
                        font-weight: bold;
                        display: inline-block;">
                Ver Brindes Disponíveis
              </a>
            </div>
          </div>
          
          <div style="background-color: #2196F3; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
            </p>
          </div>
        </div>
      `
    };

    for (const apoiador of apoiadores) {
      await transporter.sendMail({ ...mailOptions, to: apoiador.email });
    }

    console.log(`✅ Email de brindes enviado para ${apoiadores.length} apoiador(es)`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de brindes:', error);
    throw error;
  }
}

// Enviar email de solicitação de resgate para admin
export async function enviarEmailSolicitacaoResgate(solicitacao) {
  try {
    const { default: User } = await import('../models/user.model.js');
    const admins = await User.find({ isAdmin: true }).select('email nome');

    if (admins.length === 0) {
      console.log('⚠️  Nenhum admin para enviar notificação de resgate');
      return;
    }

    await solicitacao.populate('usuarioId', 'nome email telefone');
    await solicitacao.populate('brindeId', 'nome');

    const dataFormatada = new Date(solicitacao.dataHorarioEscolhido).toLocaleString('pt-BR');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    const mailOptions = {
      from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
      subject: '🎁 Nova solicitação de resgate de brinde',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
            <p style="color: white; margin: 10px 0 0 0;">Nova Solicitação de Resgate</p>
          </div>
          
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Detalhes da Solicitação</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Brinde:</strong> ${solicitacao.brindeId.nome}</p>
              <p style="margin: 10px 0;"><strong>Apoiador:</strong> ${solicitacao.usuarioId.nome}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${solicitacao.usuarioId.email}</p>
              <p style="margin: 10px 0;"><strong>Telefone:</strong> ${solicitacao.usuarioId.telefone}</p>
              <p style="margin: 10px 0;"><strong>Data/Hora:</strong> ${dataFormatada}</p>
              ${solicitacao.observacoes ? `<p style="margin: 10px 0;"><strong>Observações:</strong> ${solicitacao.observacoes}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/adm/resgates" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px;
                        font-weight: bold;
                        display: inline-block;">
                Gerenciar Solicitações
              </a>
            </div>
          </div>
          
          <div style="background-color: #2196F3; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
            </p>
          </div>
        </div>
      `
    };

    for (const admin of admins) {
      await transporter.sendMail({ ...mailOptions, to: admin.email });
    }

    console.log(`✅ Email de solicitação de resgate enviado para ${admins.length} admin(s)`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de solicitação:', error);
    throw error;
  }
}

// Enviar newsletter/post
export async function enviarNewsletter(post, usuarios, emailsPost) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    for (let i = 0; i < usuarios.length; i++) {
      const usuario = usuarios[i];
      const emailPost = emailsPost[i];

      const trackingPixel = `${frontendUrl}/api/posts/track/${emailPost.token}`;

      const mailOptions = {
        from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
        to: usuario.email,
        subject: post.titulo,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f5f5f5;">
              <h2 style="color: #333;">${post.titulo}</h2>
              
              <div style="color: #555; font-size: 16px; line-height: 1.6;">
                ${post.conteudoHtml}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${frontendUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; 
                          padding: 15px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-size: 16px;
                          font-weight: bold;
                          display: inline-block;">
                  Visitar Patas Solidárias
                </a>
              </div>
            </div>
            
            <div style="background-color: #2196F3; padding: 20px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">
                © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
              </p>
            </div>
            
            <img src="${trackingPixel}" width="1" height="1" style="display:none;" />
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    console.log(`✅ Newsletter enviada para ${usuarios.length} usuário(s)`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar newsletter:', error);
    throw error;
  }
}

// Enviar convite admin
export async function enviarConviteAdmin(convite, convidadoPor) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const linkConvite = `${frontendUrl}/aceitar-convite-admin?token=${convite.token}`;

    const mailOptions = {
      from: `"Patas Solidárias" <${process.env.EMAIL_USER}>`,
      to: convite.emailConvidado,
      subject: '🎉 Convite para ser Administrador - Patas Solidárias',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🐾 Patas Solidárias</h1>
            <p style="color: white; margin: 10px 0 0 0;">Convite Especial</p>
          </div>
          
          <div style="padding: 30px; background-color: #f5f5f5;">
            <h2 style="color: #333;">Parabéns! 🎉</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              <strong>${convidadoPor.nome}</strong> convidou você para ser um <strong>Administrador</strong> do Patas Solidárias!
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Como administrador, você poderá ajudar ainda mais na gestão do projeto e cuidado dos nossos patinhas.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Suas Permissões:</h3>
              ${convite.permissoes.gerenciarAnimais ? '<p style="margin: 5px 0;">✅ Gerenciar Animais</p>' : ''}
              ${convite.permissoes.gerenciarFotos ? '<p style="margin: 5px 0;">✅ Gerenciar Fotos</p>' : ''}
              ${convite.permissoes.gerenciarBrindes ? '<p style="margin: 5px 0;">✅ Gerenciar Brindes</p>' : ''}
              ${convite.permissoes.gerenciarPosts ? '<p style="margin: 5px 0;">✅ Gerenciar Posts</p>' : ''}
              ${convite.permissoes.visualizarAssinantes ? '<p style="margin: 5px 0;">✅ Visualizar Assinantes</p>' : ''}
              ${convite.permissoes.convidarAdmins ? '<p style="margin: 5px 0;">✅ Convidar Admins</p>' : ''}
              ${convite.permissoes.gerenciarConfiguracoes ? '<p style="margin: 5px 0;">✅ Gerenciar Configurações</p>' : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkConvite}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px;
                        font-weight: bold;
                        display: inline-block;">
                Aceitar Convite
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px;">
              Ou copie e cole este link no seu navegador:<br>
              <a href="${linkConvite}" style="color: #667eea;">${linkConvite}</a>
            </p>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>⚠️ Atenção:</strong> Este convite expira em 7 dias.
              </p>
            </div>
          </div>
          
          <div style="background-color: #2196F3; padding: 20px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">
              © ${new Date().getFullYear()} Patas Solidárias - UTFPR Medianeira
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de convite admin enviado para:', convite.emailConvidado);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar convite admin:', error);
    throw error;
  }
}

export default transporter;
