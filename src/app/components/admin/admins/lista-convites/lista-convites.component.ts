import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@services/admin.service';

@Component({
    selector: 'app-lista-convites',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container">
      <h1>Convites de Admin</h1>
      
      <div class="form-card">
        <h2>Enviar Novo Convite</h2>
        <div class="form-group">
          <label>Email *</label>
          <input type="email" [(ngModel)]="novoEmail" class="control" placeholder="email@exemplo.com">
        </div>
        <button (click)="enviarConvite()" class="btn-primary" [disabled]="!novoEmail">Enviar Convite</button>
      </div>

      <div *ngIf="carregando">Carregando convites...</div>
      <table *ngIf="!carregando && convites.length > 0">
        <thead>
          <tr><th>Email</th><th>Status</th><th>Data Criação</th><th>Expira em</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of convites">
            <td>{{ c.emailConvidado }}</td>
            <td><span [class]="c.status">{{ c.status }}</span></td>
            <td>{{ c.dataCriacao | date:'dd/MM/yyyy' }}</td>
            <td>{{ c.dataExpiracao | date:'dd/MM/yyyy' }}</td>
            <td><button (click)="cancelar(c._id)" class="btn-sm">Cancelar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    .form-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    h2 { font-size: 1.3rem; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; }
    .btn-primary { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #f7fafc; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-top: 1px solid #e2e8f0; }
    .pendente { color: #ed8936; font-weight: 600; }
    .aceito { color: #48bb78; font-weight: 600; }
    .cancelado, .expirado { color: #f56565; font-weight: 600; }
    .btn-sm { padding: 0.5rem 1rem; border: none; border-radius: 6px; background: #718096; color: white; cursor: pointer; }
  `]
})
export class ListaConvitesComponent implements OnInit {
    private adminService = inject(AdminService);
    convites: any[] = [];
    novoEmail = '';
    carregando = true;

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.adminService.listarConvites().subscribe({
            next: (data: any) => {
                this.convites = data;
                this.carregando = false;
            }
        });
    }

    enviarConvite(): void {
        if (!this.novoEmail) return;

        const permissoesDefault = {
            gerenciarAnimais: true,
            gerenciarFotos: true,
            gerenciarBrindes: true,
            gerenciarPosts: true,
            visualizarAssinantes: true,
            convidarAdmins: false,
            gerenciarConfiguracoes: false
        };

        this.adminService.criarConvite(this.novoEmail, permissoesDefault).subscribe({
            next: () => {
                alert('Convite enviado!');
                this.novoEmail = '';
                this.carregar();
            },
            error: () => alert('Erro ao enviar convite')
        });
    }

    cancelar(id: string): void {
        this.adminService.cancelarConvite(id).subscribe({
            next: () => {
                alert('Convite cancelado!');
                this.carregar();
            }
        });
    }
}
