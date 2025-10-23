import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResgateService } from '@services/resgate.service';

@Component({
    selector: 'app-config-resgate',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container">
      <h1>Configuração de Resgates</h1>
      <div *ngIf="carregando">Carregando...</div>
      <form *ngIf="!carregando" (ngSubmit)="salvar()" class="form">
        <div class="group">
          <label>Dias da Semana</label>
          <div *ngFor="let dia of diasSemana" class="checkbox">
            <input type="checkbox" [id]="dia" [(ngModel)]="config.diasSemana[dia]" [name]="dia">
            <label [for]="dia">{{ dia }}</label>
          </div>
        </div>
        
        <div class="group">
          <label>Horários (HH:MM)</label>
          <div *ngFor="let h of config.horariosDisponiveis; let i = index" class="horario">
            <input type="text" [(ngModel)]="config.horariosDisponiveis[i]" [name]="'h'+i" placeholder="09:00">
            <button type="button" (click)="removerHorario(i)">❌</button>
          </div>
          <button type="button" (click)="adicionarHorario()">➕ Adicionar Horário</button>
        </div>

        <div class="group">
          <label>Intervalo (minutos)</label>
          <input type="number" [(ngModel)]="config.intervaloMinutos" name="intervalo" min="15">
        </div>

        <button type="submit" class="btn-primary">Salvar Configuração</button>
      </form>
    </div>
  `,
    styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    .form { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .group { margin-bottom: 2rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .checkbox { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .horario { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    input[type="text"], input[type="number"] { padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 6px; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem 2rem; }
  `]
})
export class ConfigResgateComponent implements OnInit {
    config: any = {
        diasSemana: {},
        horariosDisponiveis: [],
        intervaloMinutos: 30
    };
    diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    diasSemanaMap: { [key: string]: number } = {
        'segunda': 1,
        'terca': 2,
        'quarta': 3,
        'quinta': 4,
        'sexta': 5,
        'sabado': 6,
        'domingo': 0
    };
    carregando = true;

    private resgateService = inject(ResgateService);

    ngOnInit(): void {
        this.resgateService.buscarConfiguracao().subscribe({
            next: (data: any) => {
                if (data) {
                    this.config = data;
                    const dias: any = {};
                    this.diasSemana.forEach(d => dias[d] = data.diasSemana?.includes(d));
                    this.config.diasSemana = dias;
                }
                this.carregando = false;
            }
        });
    }

    adicionarHorario(): void {
        this.config.horariosDisponiveis.push('');
    }

    removerHorario(i: number): void {
        this.config.horariosDisponiveis.splice(i, 1);
    }

    salvar(): void {
        const diasSelecionados = Object.keys(this.config.diasSemana)
            .filter(d => this.config.diasSemana[d])
            .map(d => this.diasSemanaMap[d]);

        const dados = {
            diasSemana: diasSelecionados,
            horariosDisponiveis: this.config.horariosDisponiveis.filter((h: string) => h),
            intervaloMinutos: this.config.intervaloMinutos
        };

        this.resgateService.atualizarConfiguracao(dados).subscribe({
            next: () => alert('Salvo!'),
            error: () => alert('Erro!')
        });
    }
}
