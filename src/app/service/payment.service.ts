import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Payment, 
  PixPaymentRequest, 
  SubscriptionRequest, 
  DonationStats,
  MercadoPagoPreference,
  MercadoPagoSubscription
} from '../model/payment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  // ============================================
  // MERCADO PAGO - PIX PAYMENT
  // ============================================
  
  /**
   * Cria um pagamento PIX através do Mercado Pago
   * Retorna QR Code e dados para pagamento
   */
  createPixPayment(paymentData: PixPaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/mercadopago/pix`, paymentData);
  }

  /**
   * Cria uma preferência de pagamento no Mercado Pago
   * Para pagamentos com cartão, boleto, etc.
   */
  createPaymentPreference(preference: MercadoPagoPreference): Observable<any> {
    return this.http.post(`${this.apiUrl}/mercadopago/preference`, preference);
  }

  // ============================================
  // MERCADO PAGO - SUBSCRIPTIONS (PREAPPROVAL)
  // ============================================
  
  /**
   * Cria uma assinatura recorrente (preapproval) no Mercado Pago
   */
  createSubscription(subscriptionData: SubscriptionRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/mercadopago/subscription`, subscriptionData);
  }

  /**
   * Obtém detalhes de uma assinatura
   */
  getSubscription(subscriptionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/mercadopago/subscription/${subscriptionId}`);
  }

  /**
   * Cancela uma assinatura
   */
  cancelSubscription(subscriptionId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/mercadopago/subscription/${subscriptionId}/cancel`,
      {}
    );
  }

  /**
   * Pausa uma assinatura
   */
  pauseSubscription(subscriptionId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/mercadopago/subscription/${subscriptionId}/pause`,
      {}
    );
  }

  // ============================================
  // PAYMENT MANAGEMENT
  // ============================================
  
  /**
   * Lista todos os pagamentos do usuário
   */
  getUserPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user`);
  }

  /**
   * Verifica o status de um pagamento específico
   */
  checkPaymentStatus(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}/status`);
  }

  /**
   * Busca um pagamento pelo ID do Mercado Pago
   */
  getPaymentByMercadoPagoId(mercadoPagoId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/mercadopago/${mercadoPagoId}`);
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================
  
  /**
   * Lista todos os pagamentos (Admin)
   */
  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/all`);
  }

  /**
   * Obtém estatísticas de doações (Admin)
   */
  getDonationStats(): Observable<DonationStats> {
    return this.http.get<DonationStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Atualiza manualmente o status de um pagamento (Admin)
   */
  updatePaymentStatus(paymentId: string, status: string): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}/${paymentId}/status`, { status });
  }

  /**
   * Processa refund/estorno de um pagamento (Admin)
   */
  refundPayment(paymentId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/${paymentId}/refund`,
      {}
    );
  }

  // ============================================
  // WEBHOOKS
  // ============================================
  
  /**
   * Endpoint para receber notificações do Mercado Pago
   * Deve ser configurado no painel do Mercado Pago
   */
  handleMercadoPagoWebhook(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mercadopago/webhook`, data);
  }
}
