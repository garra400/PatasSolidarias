export interface Payment {
  _id?: string;
  userId: string;
  tipo: 'pix' | 'subscription';
  valor: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_process';
  dataCriacao: Date;
  dataProcessamento?: Date;
  pixData?: {
    qrCode: string;
    qrCodeBase64: string;
    qrCodeData: string;
    transactionId: string;
  };
  subscriptionData?: {
    plataforma: 'mercadopago';
    subscriptionId: string;
    preapprovalId: string;
    initPoint: string;
    nextPaymentDate?: Date;
  };
  mercadoPagoData?: {
    id: string;
    status: string;
    statusDetail?: string;
    paymentMethodId?: string;
    paymentTypeId?: string;
  };
  descricao?: string;
}

export interface PixPaymentRequest {
  valor: number;
  descricao?: string;
  email: string;
  nome: string;
}

export interface SubscriptionRequest {
  valorMensal: number;
  plataforma: 'mercadopago';
  email: string;
  nome: string;
}

export interface MercadoPagoPreference {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  payer?: {
    name?: string;
    email?: string;
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  payment_methods?: {
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
}

export interface MercadoPagoSubscription {
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
  payer_email: string;
}

export interface DonationStats {
  totalArrecadado: number;
  totalDoacoes: number;
  totalDoadores: number;
  doadoresAtivos: number;
  arrecadacaoMensal: {
    mes: string;
    valor: number;
  }[];
}
