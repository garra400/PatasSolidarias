import express from 'express';
import User from '../models/user.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Registrar pagamento PIX avulso
router.post('/pix', verifyToken, async (req, res) => {
  try {
    const { valor, mercadoPagoId } = req.body;
    const userId = req.user.id;

    // Gerar mês de referência atual
    const agora = new Date();
    const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar pagamento ao histórico
    const novoPagamento = {
      tipo: 'pix',
      valor,
      status: 'aprovado', // Em produção, isso viria da confirmação do MercadoPago
      data: new Date(),
      mercadoPagoId,
      mesReferencia
    };

    user.historicoPagamentos.push(novoPagamento);
    
    // Recalcular meses de apoio e brindes
    user.calcularMesesApoio();
    
    await user.save();

    res.json({
      message: 'Pagamento registrado com sucesso!',
      totalMesesApoio: user.totalMesesApoio,
      brindesDisponiveis: user.brindesDisponiveis,
      isDoador: user.isDoador
    });
  } catch (error) {
    console.error('Erro ao registrar pagamento PIX:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

// Criar assinatura mensal
router.post('/assinatura', verifyToken, async (req, res) => {
  try {
    const { valorMensal, mercadoPagoId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Configurar assinatura
    const agora = new Date();
    const proximoPagamento = new Date(agora);
    proximoPagamento.setMonth(proximoPagamento.getMonth() + 1);

    user.assinaturaAtiva = {
      tipo: 'mensal',
      valorMensal,
      dataInicio: agora,
      dataProximoPagamento: proximoPagamento,
      status: 'ativa'
    };

    // Registrar primeiro pagamento da assinatura
    const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    
    user.historicoPagamentos.push({
      tipo: 'assinatura',
      valor: valorMensal,
      status: 'aprovado',
      data: agora,
      mercadoPagoId,
      mesReferencia
    });

    // Recalcular
    user.calcularMesesApoio();
    
    await user.save();

    res.json({
      message: 'Assinatura criada com sucesso!',
      assinatura: user.assinaturaAtiva,
      totalMesesApoio: user.totalMesesApoio,
      brindesDisponiveis: user.brindesDisponiveis,
      isDoador: user.isDoador
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ message: 'Erro ao processar assinatura' });
  }
});

// Cancelar assinatura
router.post('/assinatura/cancelar', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user || !user.assinaturaAtiva) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }

    user.assinaturaAtiva.status = 'cancelada';
    user.calcularMesesApoio(); // Recalcular status de doador
    
    await user.save();

    res.json({ message: 'Assinatura cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: 'Erro ao cancelar assinatura' });
  }
});

// Processar pagamento recorrente (webhook do MercadoPago)
router.post('/webhook/mercadopago', async (req, res) => {
  try {
    const { userId, valor, mercadoPagoId, status } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Gerar mês de referência
    const agora = new Date();
    const mesReferencia = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

    // Adicionar pagamento
    user.historicoPagamentos.push({
      tipo: 'assinatura',
      valor,
      status: status === 'approved' ? 'aprovado' : 'pendente',
      data: agora,
      mercadoPagoId,
      mesReferencia
    });

    // Se aprovado, atualizar data do próximo pagamento
    if (status === 'approved' && user.assinaturaAtiva) {
      const proximoPagamento = new Date(user.assinaturaAtiva.dataProximoPagamento);
      proximoPagamento.setMonth(proximoPagamento.getMonth() + 1);
      user.assinaturaAtiva.dataProximoPagamento = proximoPagamento;
    }

    // Recalcular
    user.calcularMesesApoio();
    
    await user.save();

    res.json({ message: 'Webhook processado com sucesso' });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ message: 'Erro ao processar webhook' });
  }
});

// Obter histórico de pagamentos do usuário
router.get('/historico', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('historicoPagamentos totalMesesApoio brindesDisponiveis isDoador assinaturaAtiva');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      historicoPagamentos: user.historicoPagamentos,
      totalMesesApoio: user.totalMesesApoio,
      brindesDisponiveis: user.brindesDisponiveis,
      isDoador: user.isDoador,
      assinaturaAtiva: user.assinaturaAtiva
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
});

export default router;
