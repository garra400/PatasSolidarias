import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../service/payment.service';
import { AuthService } from '../../../service/auth.service';
import { Payment } from '../../../model/payment.model';

@Component({
  selector: 'app-seja-padrinho',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seja-padrinho.component.html',
  styleUrl: './seja-padrinho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SejaPadrinhoComponent implements OnInit {
  paymentForm: FormGroup;
  selectedOption: 'pix' | 'subscription' | null = null;
  pixPayment: Payment | null = null;
  isLoading = false;
  errorMessage = '';
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.paymentForm = this.fb.group({
      valor: ['', [Validators.required, Validators.min(1)]],
      valorMensal: [15, [Validators.required, Validators.min(15)]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.cdr.markForCheck();
    });
  }

  selectPaymentOption(option: 'pix' | 'subscription'): void {
    if (this.selectedOption === option) {
      return; // Já está selecionado, não fazer nada
    }
    
    this.selectedOption = option;
    this.pixPayment = null;
    this.errorMessage = '';
    this.cdr.markForCheck(); // Forçar atualização da view
  }

  createPixPayment(): void {
    if (this.paymentForm.get('valor')?.valid && this.currentUser) {
      this.isLoading = true;
      this.errorMessage = '';
      this.cdr.markForCheck();

      this.paymentService.createPixPayment({
        valor: this.paymentForm.get('valor')?.value,
        descricao: 'Doação Patas Solidárias',
        email: this.currentUser.email,
        nome: this.currentUser.nome
      }).subscribe({
        next: (payment) => {
          this.pixPayment = payment;
          this.isLoading = false;
          this.cdr.markForCheck();
          
          // Iniciar polling para verificar status do pagamento
          this.startPaymentStatusPolling(payment._id!);
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erro ao gerar pagamento PIX';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  createSubscription(): void {
    if (this.paymentForm.get('valorMensal')?.valid && this.currentUser) {
      this.isLoading = true;
      this.errorMessage = '';
      this.cdr.markForCheck();

      this.paymentService.createSubscription({
        valorMensal: this.paymentForm.get('valorMensal')?.value,
        plataforma: 'mercadopago',
        email: this.currentUser.email,
        nome: this.currentUser.nome
      }).subscribe({
        next: (payment) => {
          // Redirecionar para página de pagamento do Mercado Pago
          if (payment.subscriptionData?.initPoint) {
            window.location.href = payment.subscriptionData.initPoint;
          } else {
            this.errorMessage = 'Erro ao gerar link de pagamento';
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erro ao criar assinatura';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  copyPixCode(): void {
    if (this.pixPayment?.pixData?.qrCodeData) {
      navigator.clipboard.writeText(this.pixPayment.pixData.qrCodeData).then(() => {
        alert('Código PIX copiado!');
      }).catch(() => {
        alert('Erro ao copiar código PIX');
      });
    }
  }

  private startPaymentStatusPolling(paymentId: string): void {
    const interval = setInterval(() => {
      this.paymentService.checkPaymentStatus(paymentId).subscribe({
        next: (payment) => {
          if (payment.status === 'approved') {
            clearInterval(interval);
            alert('Pagamento confirmado! Obrigado pela sua doação.');
            this.router.navigate(['/dashboard']);
          } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
            clearInterval(interval);
            this.errorMessage = 'Pagamento não foi concluído. Tente novamente.';
            this.cdr.markForCheck();
          }
        },
        error: () => {
          // Continuar polling mesmo com erro
        }
      });
    }, 5000); // Verificar a cada 5 segundos

    // Parar após 5 minutos
    setTimeout(() => clearInterval(interval), 300000);
  }

  formatCurrency(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    this.paymentForm.patchValue({ valor: parseFloat(value) }, { emitEvent: false });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '⏳ Aguardando pagamento',
      'approved': '✅ Pagamento aprovado',
      'rejected': '❌ Pagamento rejeitado',
      'cancelled': '🚫 Pagamento cancelado',
      'in_process': '⏳ Em processamento'
    };
    return statusMap[status] || status;
  }
}
