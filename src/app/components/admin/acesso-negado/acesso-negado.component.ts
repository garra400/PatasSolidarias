import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-acesso-negado',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="acesso-negado-container">
      <div class="content">
        <div class="icon">🚫</div>
        <h1>Acesso Negado</h1>
        <p>Você não possui permissão para acessar esta página.</p>
        <p class="details">Entre em contato com um administrador para solicitar acesso.</p>
        <div class="actions">
          <a routerLink="/adm" class="btn btn-primary">Voltar ao Dashboard</a>
          <a routerLink="/" class="btn btn-secondary">Ir para Home</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .acesso-negado-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .content {
      background: white;
      border-radius: 16px;
      padding: 3rem;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .details {
      font-size: 0.95rem;
      color: #999;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;

      &:hover {
        background: #cbd5e0;
      }
    }

    @media (max-width: 768px) {
      .content {
        padding: 2rem;
      }

      .actions {
        flex-direction: column;

        .btn {
          width: 100%;
        }
      }
    }
  `]
})
export class AcessoNegadoComponent { }
