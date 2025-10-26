import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BrindeService } from '@services/brinde.service';
import { ImageUrlHelper } from '@app/utils/image-url.helper';

@Component({
    selector: 'app-lista-brindes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './lista-brindes.component.html',
    styleUrls: ['./lista-brindes.component.scss']
})
export class ListaBrindesComponent implements OnInit {
    private brindeService = inject(BrindeService);
    private router = inject(Router);

    brindes: any[] = [];
    carregando = true;
    erro = '';
    sucesso = '';

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.carregando = true;
        this.erro = '';
        this.brindeService.listarBrindes().subscribe({
            next: (data: any) => {
                // O backend retorna { brindes: [], total: number }
                this.brindes = (data.brindes || data || []).map((brinde: any) => ({
                    ...brinde,
                    fotoUrl: ImageUrlHelper.getFullImageUrl(brinde.fotoUrl)
                }));
                console.log('📦 Brindes carregados:', this.brindes);
                this.carregando = false;
            },
            error: (err: any) => {
                console.error('❌ Erro ao carregar brindes:', err);
                this.erro = 'Erro ao carregar brindes';
                this.carregando = false;
            }
        });
    }

    abrirSelecao(): void {
        this.router.navigate(['/adm/brindes/selecionar']);
    }

    confirmarDelecao(brinde: any): void {
        if (confirm(`Tem certeza que deseja deletar o brinde "${brinde.nome}"?`)) {
            this.deletar(brinde._id);
        }
    }

    deletar(id: string): void {
        this.brindeService.deletarBrinde(id).subscribe({
            next: () => {
                this.sucesso = 'Brinde deletado com sucesso!';
                // Recarrega a lista automaticamente
                this.carregar();
                // Limpa a mensagem após 3 segundos
                setTimeout(() => this.sucesso = '', 3000);
            },
            error: (err: any) => {
                console.error('❌ Erro ao deletar brinde:', err);
                this.erro = 'Erro ao deletar brinde';
                this.carregando = false;
                setTimeout(() => this.erro = '', 3000);
            }
        });
    }
}
