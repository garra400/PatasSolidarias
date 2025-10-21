import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assinatura',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="assinatura-container">
      <div class="page-header">
        <h1>📋 Minha Assinatura</h1>
        <p>Gerencie sua assinatura mensal</p>
      </div>

      <div class="subscription-card">
        <div class="subscription-header">
          <div>
            <h2>Apoiador Prata</h2>
            <p>Assinatura Ativa</p>
          </div>
          <div class="subscription-value">
            <span class="value">R$ 25,00</span>
            <span class="period">/mês</span>
          </div>
        </div>

        <div class="subscription-details">
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value active">✅ Ativa</span>
          </div>
          <div class="detail-row">
            <span class="label">Próximo pagamento:</span>
            <span class="value">01/11/2024</span>
          </div>
          <div class="detail-row">
            <span class="label">Método de pagamento:</span>
            <span class="value">Mercado Pago</span>
          </div>
        </div>

        <div class="subscription-actions">
          <button class="btn-secondary" (click)="changeValue()">Alterar Valor</button>
          <button class="btn-danger" (click)="cancelSubscription()">Cancelar Assinatura</button>
        </div>
      </div>

      <div class="benefits-card">
        <h3>Seus Benefícios Ativos</h3>
        <ul class="benefits-list">
          <li>✅ Fotos exclusivas mensais dos pets</li>
          <li>✅ Brindes personalizados a cada 3 meses</li>
          <li>✅ Adesivos únicos e broches</li>
          <li>✅ Pasta com fotos exclusivas</li>
          <li>✅ Notificações por email</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .assinatura-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 30px;

      h1 {
        font-size: 2rem;
        color: #333;
        margin: 0 0 10px 0;
      }

      p {
        color: #666;
        margin: 0;
      }
    }

    .subscription-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 25px;

      .subscription-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 2px solid #f3f4f6;
        margin-bottom: 25px;

        h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        p {
          margin: 0;
          color: #10b981;
          font-weight: 600;
        }

        .subscription-value {
          text-align: right;

          .value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
          }

          .period {
            color: #666;
          }
        }
      }

      .subscription-details {
        margin-bottom: 25px;

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid #f3f4f6;

          .label {
            color: #666;
          }

          .value {
            font-weight: 600;
            color: #333;

            &.active {
              color: #10b981;
            }
          }
        }
      }

      .subscription-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;

        button {
          flex: 1;
          min-width: 150px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;

          &.btn-secondary {
            background: #f3f4f6;
            color: #333;
            border: 2px solid #e0e0e0;

            &:hover {
              background: #e5e7eb;
              border-color: #667eea;
            }
          }

          &.btn-danger {
            background: #fef2f2;
            color: #dc2626;
            border: 2px solid #fecaca;

            &:hover {
              background: #fee2e2;
              border-color: #dc2626;
            }
          }
        }
      }
    }

    .benefits-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      h3 {
        margin: 0 0 20px 0;
        color: #333;
      }

      .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 12px 0;
          color: #666;
          font-size: 1rem;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssinaturaComponent {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  changeValue(): void {
    alert('Funcionalidade em desenvolvimento. Em breve você poderá alterar o valor da sua assinatura.');
  }

  cancelSubscription(): void {
    if (confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos benefícios exclusivos.')) {
      alert('Assinatura cancelada. Você ainda terá acesso até o fim do período pago.');
    }
  }
}
