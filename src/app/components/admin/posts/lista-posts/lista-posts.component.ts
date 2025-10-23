import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '@services/post.service';

@Component({
    selector: 'app-lista-posts',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="container">
      <header>
        <div>
          <h1>Gerenciar Posts</h1>
          <p>Newsletter e posts para apoiadores</p>
        </div>
        <a routerLink="/adm/posts/novo" class="btn">➕ Novo Post</a>
      </header>
      <div *ngIf="carregando">Carregando...</div>
      <table *ngIf="!carregando && posts.length > 0">
        <thead>
          <tr><th>Título</th><th>Destinatários</th><th>Enviado</th><th>Data</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let post of posts">
            <td>{{ post.titulo }}</td>
            <td>{{ post.destinatarios }}</td>
            <td><span [class]="post.dataEnvio ? 'sent' : 'draft'">{{ post.dataEnvio ? 'Sim' : 'Rascunho' }}</span></td>
            <td>{{ post.dataCriacao | date:'dd/MM/yyyy' }}</td>
            <td>
              <a [routerLink]="['/adm/posts/editar', post._id]" class="btn-sm">✏️</a>
              <button (click)="deletar(post._id)" class="btn-sm danger">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; }
    p { color: #666; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; text-decoration: none; cursor: pointer; }
    table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #f7fafc; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-top: 1px solid #e2e8f0; }
    .sent { color: #48bb78; font-weight: 600; }
    .draft { color: #ed8936; font-weight: 600; }
    .btn-sm { padding: 0.5rem 0.75rem; margin: 0 0.25rem; border: none; border-radius: 6px; cursor: pointer; background: #718096; color: white; text-decoration: none; }
    .btn-sm.danger { background: #f56565; }
  `]
})
export class ListaPostsComponent implements OnInit {
    private postService = inject(PostService);
    posts: any[] = [];
    carregando = true;

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.postService.listarPosts().subscribe({
            next: (data: any) => {
                this.posts = data;
                this.carregando = false;
            }
        });
    }

    deletar(id: string): void {
        if (confirm('Deletar post?')) {
            this.postService.deletarPost(id).subscribe(() => {
                alert('Deletado!');
                this.carregar();
            });
        }
    }
}
