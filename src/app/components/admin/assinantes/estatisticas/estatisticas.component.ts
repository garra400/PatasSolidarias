import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssinanteService } from '@services/assinante.service';

@Component({
    selector: 'app-estatisticas',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Estatísticas de Apoiadores</h1>
      <div *ngIf="carregando">Carregando...</div>
      <div *ngIf="!carregando" class="stats-grid">
        <div class="stat-card">
          <div class="icon">👥</div>
          <h3>Total de Apoiadores</h3>
          <p class="value">{{ stats.totalApoiadores }}</p>
        </div>
        <div class="stat-card">
          <div class="icon">✅</div>
          <h3>Apoiadores Ativos</h3>
          <p class="value">{{ stats.apoiadoresAtivos }}</p>
        </div>
        <div class="stat-card">
          <div class="icon">💰</div>
          <h3>Total Arrecadado</h3>
          <p class="value">{{ stats.totalArrecadado | currency:'BRL' }}</p>
        </div>
        <div class="stat-card">
          <div class="icon">📊</div>
          <h3>Média por Apoiador</h3>
          <p class="value">{{ stats.valorMedioPorApoiador | currency:'BRL' }}</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .stat-card { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
    .icon { font-size: 3rem; margin-bottom: 1rem; }
    h3 { font-size: 1rem; color: #666; margin-bottom: 0.5rem; }
    .value { font-size: 2rem; font-weight: 700; color: #333; }
  `]
})
export class EstatisticasComponent implements OnInit {
    private assinanteService = inject(AssinanteService);
    stats: any = {};
    carregando = true;

    ngOnInit(): void {
        this.assinanteService.buscarEstatisticasGerais().subscribe({
            next: (data: any) => {
                this.stats = data;
                this.carregando = false;
            }
        });
    }
}
