import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '@services/admin.service';

@Component({
    selector: 'app-aceitar-convite',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './aceitar-convite.component.html',
    styleUrl: './aceitar-convite.component.scss'
})
export class AceitarConviteComponent implements OnInit {
    convite: any = null;
    token = '';
    carregando = true;
    processando = false;
    erro = '';
    sucesso = false;

    private adminService = inject(AdminService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['token']) {
                this.token = params['token'];
                this.verificarConvite();
            } else {
                this.erro = 'Token de convite não fornecido';
                this.carregando = false;
            }
        });
    }

    verificarConvite(): void {
        this.adminService.verificarConvite(this.token).subscribe({
            next: (response: any) => {
                this.convite = response.convite || response;
                this.carregando = false;
            },
            error: (err: any) => {
                this.erro = err.error?.message || 'Convite inválido, expirado ou já utilizado';
                this.carregando = false;
            }
        });
    }

    aceitar(): void {
        this.processando = true;
        this.erro = '';

        this.adminService.aceitarConvite(this.token).subscribe({
            next: () => {
                this.sucesso = true;
                this.processando = false;

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    this.router.navigate(['/adm']);
                }, 2000);
            },
            error: (err: any) => {
                this.erro = err.error?.message || 'Erro ao aceitar convite. Tente novamente.';
                this.processando = false;
            }
        });
    }

    recusar(): void {
        if (confirm('Tem certeza que deseja recusar este convite?')) {
            this.router.navigate(['/']);
        }
    }

    formatarData(data: Date): string {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    contarPermissoes(permissoes: any): number {
        if (!permissoes) return 0;
        return Object.values(permissoes).filter(v => v === true).length;
    }
}
