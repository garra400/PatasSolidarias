import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '@services/admin.service';

@Component({
    selector: 'app-aceitar-convite',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <div class="card">
        <div *ngIf="carregando" class="loading">
          <div class="spinner">⏳</div>
          <p>Verificando convite...</p>
        </div>
        
        <div *ngIf="!carregando && convite">
          <div class="icon">✉️</div>
          <h1>Convite de Administrador</h1>
          <p class="email">Você foi convidado como administrador</p>
          <p class="details">Email: {{ convite.emailConvidado }}</p>
          <div class="actions">
            <button (click)="aceitar()" class="btn-primary">Aceitar Convite</button>
            <button (click)="recusar()" class="btn-secondary">Recusar</button>
          </div>
        </div>

        <div *ngIf="!carregando && erro" class="error">
          <div class="icon">❌</div>
          <h2>Convite Inválido</h2>
          <p>{{ erro }}</p>
          <a routerLink="/" class="btn-secondary">Voltar para Home</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; }
    .card { background: white; border-radius: 16px; padding: 3rem; text-align: center; max-width: 500px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); }
    .icon { font-size: 4rem; margin-bottom: 1rem; }
    h1 { font-size: 2rem; font-weight: 700; color: #333; margin-bottom: 1rem; }
    h2 { font-size: 1.5rem; color: #333; margin-bottom: 1rem; }
    .email { font-size: 1.2rem; color: #666; margin-bottom: 0.5rem; }
    .details { font-size: 1rem; color: #999; margin-bottom: 2rem; }
    .actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }
    .loading { padding: 2rem; }
    .spinner { font-size: 3rem; animation: spin 2s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .error p { color: #666; margin-bottom: 1.5rem; }
  `]
})
export class AceitarConviteComponent implements OnInit {
    convite: any = null;
    token = '';
    carregando = true;
    erro = '';

    private adminService = inject(AdminService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['token']) {
                this.token = params['token'];
                this.verificarConvite();
            }
        });
    }

    verificarConvite(): void {
        this.adminService.verificarConvite(this.token).subscribe({
            next: (data: any) => {
                this.convite = data;
                this.carregando = false;
            },
            error: (err: any) => {
                this.erro = err.error?.message || 'Convite inválido ou expirado';
                this.carregando = false;
            }
        });
    }

    aceitar(): void {
        this.adminService.aceitarConvite(this.token).subscribe({
            next: () => {
                alert('Convite aceito! Você agora é um administrador.');
                this.router.navigate(['/adm']);
            },
            error: () => {
                alert('Erro ao aceitar convite');
            }
        });
    }

    recusar(): void {
        this.router.navigate(['/']);
    }
}
