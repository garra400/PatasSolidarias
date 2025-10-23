import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrindeService } from '@services/brinde.service';

@Component({
    selector: 'app-lista-brindes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container">
      <header class="header">
        <div>
          <h1>Gerenciar Brindes</h1>
          <p>Lista de todos os brindes disponíveis</p>
        </div>
        <a routerLink="/adm/brindes/novo" class="btn btn-primary">➕ Novo Brinde</a>
      </header>

      <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
      <div *ngIf="carregando" class="loading">Carregando brindes...</div>

      <div *ngIf="!carregando && brindes.length === 0" class="empty">
        <div class="icon">🎁</div>
        <h2>Nenhum brinde cadastrado</h2>
        <a routerLink="/adm/brindes/novo" class="btn btn-primary">Adicionar Brinde</a>
      </div>

      <div *ngIf="!carregando && brindes.length > 0" class="grid">
        <div *ngFor="let brinde of brindes" class="card">
          <div class="foto">
            <img [src]="brinde.fotoUrl || 'assets/placeholder.png'" [alt]="brinde.nome">
            <span class="badge" [class.ativo]="brinde.disponivelParaResgate">
              {{ brinde.disponivelParaResgate ? 'Disponível' : 'Indisponível' }}
            </span>
          </div>
          <div class="info">
            <h3>{{ brinde.nome }}</h3>
            <p>{{ brinde.descricao }}</p>
          </div>
          <div class="actions">
            <a [routerLink]="['/adm/brindes/editar', brinde._id]" class="btn btn-sm btn-secondary">✏️ Editar</a>
            <button (click)="deletar(brinde._id)" class="btn btn-sm btn-danger">🗑️ Deletar</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    h1 { font-size: 2rem; font-weight: 700; color: #333; margin-bottom: 0.3rem; }
    p { color: #666; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .btn-secondary { background: #718096; color: white; }
    .btn-secondary:hover { background: #4a5568; }
    .btn-danger { background: #f56565; color: white; }
    .btn-danger:hover { background: #e53e3e; }
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.9rem; }
    .alert { padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
    .alert-danger { background-color: #fee; color: #c33; border: 1px solid #fcc; }
    .loading, .empty { text-align: center; padding: 4rem 2rem; color: #666; }
    .empty .icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty h2 { font-size: 1.5rem; color: #333; margin-bottom: 1.5rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15); }
    .foto { position: relative; width: 100%; height: 200px; overflow: hidden; }
    .foto img { width: 100%; height: 100%; object-fit: cover; }
    .badge { position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; background: #718096; color: white; }
    .badge.ativo { background: #48bb78; }
    .info { padding: 1.5rem; }
    .info h3 { font-size: 1.3rem; font-weight: 700; color: #333; margin-bottom: 0.5rem; }
    .info p { font-size: 0.9rem; color: #555; }
    .actions { padding: 1rem 1.5rem; background: #f7fafc; display: flex; gap: 0.5rem; }
    .actions .btn { flex: 1; justify-content: center; }
  `]
})
export class ListaBrindesComponent implements OnInit {
    private brindeService = inject(BrindeService);
    brindes: any[] = [];
    carregando = true;
    erro = '';

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.carregando = true;
        this.brindeService.listarBrindes().subscribe({
            next: (data: any) => {
                this.brindes = data;
                this.carregando = false;
            },
            error: (err: any) => {
                this.erro = 'Erro ao carregar brindes';
                this.carregando = false;
            }
        });
    }

    deletar(id: string): void {
        if (!confirm('Tem certeza?')) return;
        this.brindeService.deletarBrinde(id).subscribe({
            next: () => {
                alert('Brinde deletado!');
                this.carregar();
            },
            error: () => alert('Erro ao deletar')
        });
    }
}
