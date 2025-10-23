import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AssinanteService } from '@services/assinante.service';

@Component({
    selector: 'app-detalhe-assinante',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Detalhes do Apoiador</h1>
      <div *ngIf="carregando">Carregando...</div>
      <div *ngIf="!carregando && assinante" class="card">
        <h2>{{ assinante.nome }}</h2>
        <p><strong>Email:</strong> {{ assinante.email }}</p>
        <p><strong>Valor Mensal:</strong> {{ assinante.valorMensal | currency:'BRL' }}</p>
        <p><strong>Status:</strong> <span [class]="assinante.statusAssinatura">{{ assinante.statusAssinatura }}</span></p>
        <p><strong>Data Início:</strong> {{ assinante.dataInicio | date:'dd/MM/yyyy' }}</p>
        <p *ngIf="assinante.dataFim"><strong>Data Fim:</strong> {{ assinante.dataFim | date:'dd/MM/yyyy' }}</p>
      </div>
    </div>
  `,
    styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    .card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }
    p { margin-bottom: 1rem; font-size: 1.1rem; }
    strong { font-weight: 600; }
    .ativo { color: #48bb78; font-weight: 600; }
    .inativo, .cancelado { color: #f56565; font-weight: 600; }
  `]
})
export class DetalheAssinanteComponent implements OnInit {
    private assinanteService = inject(AssinanteService);
    private route = inject(ActivatedRoute);
    assinante: any = null;
    carregando = true;

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.assinanteService.buscarAssinantePorId(params['id']).subscribe({
                    next: (data: any) => {
                        this.assinante = data;
                        this.carregando = false;
                    }
                });
            }
        });
    }
}
