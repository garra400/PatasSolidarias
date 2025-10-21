# 💳 Integração Mercado Pago - Guia Completo

## 📋 Visão Geral

Este guia implementa a integração completa com a API do Mercado Pago para:
- **Pagamentos PIX** com QR Code
- **Assinaturas recorrentes** (Preapproval)
- **Webhooks** para notificações automáticas
- **Gerenciamento de pagamentos**

## 🔧 Configuração Inicial

### 1. Instalação de Dependências

```bash
npm install mercadopago
npm install axios
npm install qrcode
```

### 2. Credenciais do Mercado Pago

Obtenha suas credenciais em: https://www.mercadopago.com.br/developers

```env
# .env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxx
MERCADOPAGO_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

## 🏗️ Estrutura do Backend

### package.json

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mercadopago": "^2.0.0",
    "mongoose": "^8.0.0",
    "axios": "^1.6.2",
    "qrcode": "^1.5.3",
    "dotenv": "^16.3.1",
    "body-parser": "^1.20.2"
  }
}
```

## 📝 Implementação do Service

### services/mercadopago.service.js

```javascript
const mercadopago = require('mercadopago');
const QRCode = require('qrcode');

// Configurar credenciais
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

class MercadoPagoService {
  
  // ============================================
  // PIX PAYMENT
  // ============================================
  
  /**
   * Cria um pagamento PIX
   * @param {Object} paymentData - Dados do pagamento
   * @returns {Promise<Object>} Dados do pagamento incluindo QR Code
   */
  async createPixPayment(paymentData) {
    try {
      const { valor, descricao, email, nome } = paymentData;

      const payment = {
        transaction_amount: parseFloat(valor),
        description: descricao || 'Doação Patas Solidárias',
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: nome.split(' ')[0],
          last_name: nome.split(' ').slice(1).join(' ') || nome.split(' ')[0]
        },
        notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`
      };

      const response = await mercadopago.payment.create(payment);
      const pixData = response.body;

      // Gerar QR Code a partir do point_of_interaction
      let qrCodeBase64 = '';
      let qrCode = '';
      
      if (pixData.point_of_interaction?.transaction_data?.qr_code) {
        const qrCodeData = pixData.point_of_interaction.transaction_data.qr_code;
        qrCodeBase64 = await QRCode.toDataURL(qrCodeData);
        qrCode = await QRCode.toString(qrCodeData, { type: 'svg' });
      }

      return {
        id: pixData.id,
        status: pixData.status,
        status_detail: pixData.status_detail,
        qrCode: qrCode,
        qrCodeBase64: qrCodeBase64,
        qrCodeData: pixData.point_of_interaction?.transaction_data?.qr_code || '',
        transactionId: pixData.id.toString(),
        ticketUrl: pixData.point_of_interaction?.transaction_data?.ticket_url
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new Error(`Erro ao criar pagamento PIX: ${error.message}`);
    }
  }

  /**
   * Busca informações de um pagamento
   * @param {string} paymentId - ID do pagamento no Mercado Pago
   */
  async getPayment(paymentId) {
    try {
      const response = await mercadopago.payment.get(paymentId);
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao buscar pagamento: ${error.message}`);
    }
  }

  /**
   * Cancela/refund de um pagamento
   * @param {string} paymentId - ID do pagamento
   */
  async refundPayment(paymentId) {
    try {
      const response = await mercadopago.refund.create({
        payment_id: paymentId
      });
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao estornar pagamento: ${error.message}`);
    }
  }

  // ============================================
  // PREFERENCES (Checkout Pro)
  // ============================================

  /**
   * Cria uma preferência de pagamento (Checkout Pro)
   * @param {Object} preferenceData - Dados da preferência
   */
  async createPreference(preferenceData) {
    try {
      const preference = {
        items: preferenceData.items,
        payer: preferenceData.payer,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONTEND_URL}/pagamento/falha`,
          pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`,
        statement_descriptor: 'PATAS SOLIDARIAS',
        external_reference: preferenceData.external_reference
      };

      const response = await mercadopago.preferences.create(preference);
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao criar preferência: ${error.message}`);
    }
  }

  // ============================================
  // SUBSCRIPTIONS (Preapproval)
  // ============================================

  /**
   * Cria uma assinatura recorrente
   * @param {Object} subscriptionData - Dados da assinatura
   */
  async createSubscription(subscriptionData) {
    try {
      const { valorMensal, email, nome, userId } = subscriptionData;

      const preapproval = {
        reason: 'Apoio Mensal - Patas Solidárias',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: parseFloat(valorMensal),
          currency_id: 'BRL',
          start_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Começa amanhã
        },
        back_url: `${process.env.FRONTEND_URL}/dashboard`,
        payer_email: email,
        status: 'pending',
        external_reference: `USER_${userId}_${Date.now()}`
      };

      const response = await mercadopago.preapproval.create(preapproval);
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao criar assinatura: ${error.message}`);
    }
  }

  /**
   * Busca informações de uma assinatura
   * @param {string} preapprovalId - ID da assinatura
   */
  async getSubscription(preapprovalId) {
    try {
      const response = await mercadopago.preapproval.get(preapprovalId);
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao buscar assinatura: ${error.message}`);
    }
  }

  /**
   * Atualiza uma assinatura
   * @param {string} preapprovalId - ID da assinatura
   * @param {Object} updateData - Dados para atualizar
   */
  async updateSubscription(preapprovalId, updateData) {
    try {
      const response = await mercadopago.preapproval.update({
        id: preapprovalId,
        ...updateData
      });
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao atualizar assinatura: ${error.message}`);
    }
  }

  /**
   * Cancela uma assinatura
   * @param {string} preapprovalId - ID da assinatura
   */
  async cancelSubscription(preapprovalId) {
    try {
      const response = await mercadopago.preapproval.update({
        id: preapprovalId,
        status: 'cancelled'
      });
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao cancelar assinatura: ${error.message}`);
    }
  }

  /**
   * Pausa uma assinatura
   * @param {string} preapprovalId - ID da assinatura
   */
  async pauseSubscription(preapprovalId) {
    try {
      const response = await mercadopago.preapproval.update({
        id: preapprovalId,
        status: 'paused'
      });
      return response.body;
    } catch (error) {
      throw new Error(`Erro ao pausar assinatura: ${error.message}`);
    }
  }

  // ============================================
  // WEBHOOK VALIDATION
  // ============================================

  /**
   * Valida a assinatura do webhook do Mercado Pago
   */
  validateWebhookSignature(xSignature, xRequestId, dataId) {
    // Implementar validação de segurança do webhook
    // https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
    return true;
  }
}

module.exports = new MercadoPagoService();
```

## 🛣️ Routes

### routes/payment.routes.js

```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// ============================================
// MERCADO PAGO - PIX
// ============================================
router.post('/mercadopago/pix', protect, paymentController.createPixPayment);

// ============================================
// MERCADO PAGO - PREFERENCE
// ============================================
router.post('/mercadopago/preference', protect, paymentController.createPreference);

// ============================================
// MERCADO PAGO - SUBSCRIPTIONS
// ============================================
router.post('/mercadopago/subscription', protect, paymentController.createSubscription);
router.get('/mercadopago/subscription/:id', protect, paymentController.getSubscription);
router.put('/mercadopago/subscription/:id/cancel', protect, paymentController.cancelSubscription);
router.put('/mercadopago/subscription/:id/pause', protect, paymentController.pauseSubscription);

// ============================================
// PAYMENT MANAGEMENT
// ============================================
router.get('/user', protect, paymentController.getUserPayments);
router.get('/:id/status', protect, paymentController.checkPaymentStatus);
router.get('/mercadopago/:mpId', protect, paymentController.getPaymentByMercadoPagoId);

// ============================================
// ADMIN
// ============================================
router.get('/all', protect, restrictTo('admin'), paymentController.getAllPayments);
router.get('/stats', protect, restrictTo('admin'), paymentController.getDonationStats);
router.patch('/:id/status', protect, restrictTo('admin'), paymentController.updatePaymentStatus);
router.post('/:id/refund', protect, restrictTo('admin'), paymentController.refundPayment);

// ============================================
// WEBHOOK (público, sem auth)
// ============================================
router.post('/mercadopago/webhook', paymentController.handleWebhook);

module.exports = router;
```

## 🎮 Controller

### controllers/payment.controller.js

```javascript
const Payment = require('../models/Payment');
const User = require('../models/User');
const mercadoPagoService = require('../services/mercadopago.service');
const emailService = require('../services/email.service');

// ============================================
// CREATE PIX PAYMENT
// ============================================
exports.createPixPayment = async (req, res) => {
  try {
    const { valor, descricao, email, nome } = req.body;
    const userId = req.user._id;

    // Criar pagamento no Mercado Pago
    const mpPayment = await mercadoPagoService.createPixPayment({
      valor,
      descricao,
      email,
      nome
    });

    // Salvar no banco de dados
    const payment = await Payment.create({
      userId,
      tipo: 'pix',
      valor,
      status: 'pending',
      descricao,
      pixData: {
        qrCode: mpPayment.qrCode,
        qrCodeBase64: mpPayment.qrCodeBase64,
        qrCodeData: mpPayment.qrCodeData,
        transactionId: mpPayment.transactionId
      },
      mercadoPagoData: {
        id: mpPayment.id,
        status: mpPayment.status,
        statusDetail: mpPayment.status_detail
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    res.status(500).json({ 
      message: 'Erro ao criar pagamento PIX',
      error: error.message 
    });
  }
};

// ============================================
// CREATE SUBSCRIPTION
// ============================================
exports.createSubscription = async (req, res) => {
  try {
    const { valorMensal, email, nome } = req.body;
    const userId = req.user._id;

    // Criar assinatura no Mercado Pago
    const subscription = await mercadoPagoService.createSubscription({
      valorMensal,
      email,
      nome,
      userId
    });

    // Salvar no banco de dados
    const payment = await Payment.create({
      userId,
      tipo: 'subscription',
      valor: valorMensal,
      status: 'pending',
      descricao: 'Assinatura Mensal - Patas Solidárias',
      subscriptionData: {
        plataforma: 'mercadopago',
        subscriptionId: subscription.id,
        preapprovalId: subscription.id,
        initPoint: subscription.init_point
      },
      mercadoPagoData: {
        id: subscription.id,
        status: subscription.status
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ 
      message: 'Erro ao criar assinatura',
      error: error.message 
    });
  }
};

// ============================================
// GET SUBSCRIPTION
// ============================================
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await mercadoPagoService.getSubscription(id);
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar assinatura',
      error: error.message 
    });
  }
};

// ============================================
// CANCEL SUBSCRIPTION
// ============================================
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Verificar se a assinatura pertence ao usuário
    const payment = await Payment.findOne({
      'subscriptionData.preapprovalId': id,
      userId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }

    // Cancelar no Mercado Pago
    await mercadoPagoService.cancelSubscription(id);

    // Atualizar no banco
    payment.status = 'cancelled';
    await payment.save();

    // Atualizar usuário
    await User.findByIdAndUpdate(userId, {
      'assinaturaAtiva.status': 'cancelada'
    });

    res.json({ message: 'Assinatura cancelada com sucesso' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao cancelar assinatura',
      error: error.message 
    });
  }
};

// ============================================
// PAUSE SUBSCRIPTION
// ============================================
exports.pauseSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    
    await mercadoPagoService.pauseSubscription(id);
    
    await Payment.findOneAndUpdate(
      { 'subscriptionData.preapprovalId': id },
      { status: 'paused' }
    );

    res.json({ message: 'Assinatura pausada com sucesso' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao pausar assinatura',
      error: error.message 
    });
  }
};

// ============================================
// GET USER PAYMENTS
// ============================================
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ dataCriacao: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamentos' });
  }
};

// ============================================
// CHECK PAYMENT STATUS
// ============================================
exports.checkPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    // Buscar status atualizado no Mercado Pago
    if (payment.mercadoPagoData?.id) {
      const mpPayment = await mercadoPagoService.getPayment(payment.mercadoPagoData.id);
      
      // Atualizar status no banco
      if (mpPayment.status !== payment.status) {
        payment.status = mpPayment.status;
        payment.mercadoPagoData.status = mpPayment.status;
        payment.mercadoPagoData.statusDetail = mpPayment.status_detail;
        
        if (mpPayment.status === 'approved') {
          payment.dataProcessamento = new Date();
          
          // Atualizar usuário como doador
          await User.findByIdAndUpdate(payment.userId, {
            isDoador: true
          });
          
          // Enviar email de confirmação
          const user = await User.findById(payment.userId);
          await emailService.sendPaymentConfirmation(user.email, user.nome, payment.valor);
        }
        
        await payment.save();
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar status do pagamento' });
  }
};

// ============================================
// WEBHOOK HANDLER
// ============================================
exports.handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recebido:', type, data);

    if (type === 'payment') {
      // Buscar informações do pagamento
      const mpPayment = await mercadoPagoService.getPayment(data.id);
      
      // Atualizar pagamento no banco
      const payment = await Payment.findOne({
        'mercadoPagoData.id': data.id.toString()
      });

      if (payment) {
        payment.status = mpPayment.status;
        payment.mercadoPagoData.status = mpPayment.status;
        payment.mercadoPagoData.statusDetail = mpPayment.status_detail;

        if (mpPayment.status === 'approved') {
          payment.dataProcessamento = new Date();
          
          // Atualizar usuário
          await User.findByIdAndUpdate(payment.userId, {
            isDoador: true
          });

          // Enviar email
          const user = await User.findById(payment.userId);
          await emailService.sendPaymentConfirmation(user.email, user.nome, payment.valor);
        }

        await payment.save();
      }
    } else if (type === 'subscription_preapproval') {
      // Processar atualização de assinatura
      const subscription = await mercadoPagoService.getSubscription(data.id);
      
      await Payment.findOneAndUpdate(
        { 'subscriptionData.preapprovalId': data.id },
        {
          status: subscription.status,
          'mercadoPagoData.status': subscription.status
        }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

// ============================================
// ADMIN - GET ALL PAYMENTS
// ============================================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'nome email')
      .sort({ dataCriacao: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pagamentos' });
  }
};

// ============================================
// ADMIN - DONATION STATS
// ============================================
exports.getDonationStats = async (req, res) => {
  try {
    const totalArrecadado = await Payment.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$valor' } } }
    ]);

    const totalDoacoes = await Payment.countDocuments({ status: 'approved' });
    const totalDoadores = await User.countDocuments({ isDoador: true });
    const doadoresAtivos = await User.countDocuments({ 
      isDoador: true,
      'assinaturaAtiva.status': 'ativa'
    });

    res.json({
      totalArrecadado: totalArrecadado[0]?.total || 0,
      totalDoacoes,
      totalDoadores,
      doadoresAtivos,
      arrecadacaoMensal: [] // Implementar agregação por mês
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// ============================================
// ADMIN - REFUND PAYMENT
// ============================================
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    if (payment.mercadoPagoData?.id) {
      await mercadoPagoService.refundPayment(payment.mercadoPagoData.id);
      
      payment.status = 'refunded';
      await payment.save();
    }

    res.json({ message: 'Pagamento estornado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao estornar pagamento' });
  }
};
```

## 📧 Configurar Webhooks no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em "Webhooks"
4. Adicione a URL: `https://seu-dominio.com/api/payments/mercadopago/webhook`
5. Selecione os eventos:
   - `payment`
   - `subscription_preapproval`

## 🧪 Testando

### Teste PIX em Sandbox

```bash
curl -X POST http://localhost:3000/api/payments/mercadopago/pix \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": 50.00,
    "descricao": "Teste de doação",
    "email": "test@test.com",
    "nome": "Test User"
  }'
```

### Cartões de Teste

- **Aprovado**: 5031 4332 1540 6351
- **Recusado**: 5031 7557 3453 0604

Mais em: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

## 📚 Documentação Oficial

- [Mercado Pago API Reference](https://www.mercadopago.com.br/developers/pt/reference)
- [PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/pix)
- [Preapproval (Assinaturas)](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/introduction)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

---

✅ **Implementação completa do Mercado Pago!**
