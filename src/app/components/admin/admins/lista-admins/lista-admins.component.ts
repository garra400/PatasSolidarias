import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '@services/admin.service';

@Component({
    selector: 'app-lista-admins',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container">
      <h1>Administradores</h1>
      <div *ngIf="carregando">Carregando...</div>
      <table *ngIf="!carregando && admins.length > 0">
        <thead>
          <tr><th>Nome</th><th>Email</th><th>Permissões</th><th>Ações</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let admin of admins">
            <td>{{ admin.nome }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ contarPermissoes(admin.permissoes) }}</td>
            <td><button (click)="remover(admin._id)" class="btn-danger">🗑️ Remover</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #f7fafc; padding: 1rem; text-align: left; font-weight: 600; }
    td { padding: 1rem; border-top: 1px solid #e2e8f0; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .btn-danger { background: #f56565; color: white; }
  `]
})
export class ListaAdminsComponent implements OnInit {
    private adminService = inject(AdminService);
    admins: any[] = [];
    carregando = true;

    ngOnInit(): void {
        this.adminService.listarAdmins().subscribe({
            next: (data: any) => {
                this.admins = data;
                this.carregando = false;
            }
        });
    }

    contarPermissoes(perm: any): string {
        if (!perm) return '0';
        const count = Object.values(perm).filter(v => v === true).length;
        return `${count} permissões`;
    }

    remover(id: string): void {
        if (confirm('Remover admin?')) {
            this.adminService.removerAdmin(id).subscribe({
                next: () => {
                    alert('Removido!');
                    this.ngOnInit();
                }
            });
        }
    }
}
