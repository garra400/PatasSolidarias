import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResgateService } from '@services/resgate.service';

@Component({
    selector: 'app-lista-resgates',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Solicitações de Resgate</h1>
      <div *ngIf="carregando">Carregando...</div>
      <table *ngIf="!carregando && solicitacoes.length > 0">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Brinde</th>
            <th>Data/Hora</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let sol of solicitacoes">
            <td>{{ sol.usuarioId?.nome || 'N/A' }}</td>
            <td>{{ sol.brindeId?.nome || 'N/A' }}</td>
            <td>{{ sol.dataHorarioEscolhido | date:'dd/MM/yyyy HH:mm' }}</td>
            <td><span [class]="'status ' + sol.status">{{ sol.status }}</span></td>
            <td>
              <button *ngIf="sol.status === 'pendente'" (click)="aprovar(sol._id)">Aprovar</button>
              <button *ngIf="sol.status === 'pendente'" (click)="rejeitar(sol._id)">Rejeitar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #f7fafc; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-top: 1px solid #e2e8f0; }
    .status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .status.pendente { background: #fef3c7; color: #92400e; }
    .status.aprovado { background: #d1fae5; color: #065f46; }
    .status.rejeitado { background: #fee2e2; color: #991b1b; }
    .status.concluido { background: #dbeafe; color: #1e40af; }
    button { padding: 0.5rem 1rem; margin: 0 0.25rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
  `]
})
export class ListaResgatesComponent implements OnInit {
    private resgateService = inject(ResgateService);
    solicitacoes: any[] = [];
    carregando = true;

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.resgateService.listarSolicitacoes().subscribe({
            next: (data: any) => {
                this.solicitacoes = data;
                this.carregando = false;
            },
            error: () => this.carregando = false
        });
    }

    aprovar(id: string): void {
        this.resgateService.atualizarStatusSolicitacao(id, 'confirmado').subscribe({
            next: () => {
                alert('Aprovado!');
                this.carregar();
            }
        });
    }

    rejeitar(id: string): void {
        this.resgateService.atualizarStatusSolicitacao(id, 'cancelado').subscribe({
            next: () => {
                alert('Rejeitado!');
                this.carregar();
            }
        });
    }
}
