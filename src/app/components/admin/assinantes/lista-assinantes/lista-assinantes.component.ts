import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssinanteService } from '@services/assinante.service';

@Component({
    selector: 'app-lista-assinantes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container">
      <h1>Apoiadores</h1>
      <div *ngIf="carregando">Carregando...</div>
      <table *ngIf="!carregando && assinantes.length > 0">
        <thead>
          <tr><th>Nome</th><th>Email</th><th>Valor</th><th>Status</th><th>Desde</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of assinantes">
            <td>{{ a.nome }}</td>
            <td>{{ a.email }}</td>
            <td>{{ a.valorMensal | currency:'BRL' }}</td>
            <td><span [class]="a.statusAssinatura">{{ a.statusAssinatura }}</span></td>
            <td>{{ a.dataInicio | date:'dd/MM/yyyy' }}</td>
            <td><a [routerLink]="['/adm/assinantes', a._id]" class="btn-sm">👁️ Ver</a></td>
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
    .ativo { color: #48bb78; font-weight: 600; }
    .inativo, .cancelado { color: #f56565; font-weight: 600; }
    .btn-sm { padding: 0.5rem 1rem; border-radius: 6px; background: #667eea; color: white; text-decoration: none; font-weight: 600; }
  `]
})
export class ListaAssinantesComponent implements OnInit {
    private assinanteService = inject(AssinanteService);
    assinantes: any[] = [];
    carregando = true;

    ngOnInit(): void {
        this.assinanteService.listarAssinantes().subscribe({
            next: (data: any) => {
                this.assinantes = data.assinantes || data;
                this.carregando = false;
            }
        });
    }
}
