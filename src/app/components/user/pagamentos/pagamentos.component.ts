import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PaymentHistory {
  _id: string;
  valor: number;
  status: string;
  tipo: 'pix' | 'subscription';
  data: Date;
  descricao: string;
}

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagamentosComponent implements OnInit {
  payments: PaymentHistory[] = [];
  isLoading = false;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    
    // Mock data - substituir por chamada à API
    this.payments = [
      {
        _id: '1',
        valor: 50,
        status: 'approved',
        tipo: 'pix',
        data: new Date('2024-10-15'),
        descricao: 'Doação Única via PIX'
      },
      {
        _id: '2',
        valor: 25,
        status: 'approved',
        tipo: 'subscription',
        data: new Date('2024-10-01'),
        descricao: 'Assinatura Mensal - Apoiador Prata'
      },
      {
        _id: '3',
        valor: 25,
        status: 'approved',
        tipo: 'subscription',
        data: new Date('2024-09-01'),
        descricao: 'Assinatura Mensal - Apoiador Prata'
      }
    ];

    this.isLoading = false;
    this.cdr.markForCheck();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getTipoText(tipo: string): string {
    return tipo === 'pix' ? 'PIX' : 'Assinatura';
  }
}
