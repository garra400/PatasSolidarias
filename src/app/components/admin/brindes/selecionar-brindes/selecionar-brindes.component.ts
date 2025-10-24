import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BrindeService } from '@services/brinde.service';

@Component({
    selector: 'app-selecionar-brindes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './selecionar-brindes.component.html',
    styleUrls: ['./selecionar-brindes.component.scss']
})
export class SelecionarBrindesComponent implements OnInit {
    private brindeService = inject(BrindeService);
    private router = inject(Router);

    brindes: any[] = [];
    brindesSelecionados: string[] = [];
    carregando = true;
    salvando = false;
    erro = '';
    sucesso = '';
    mostrarModal = false;

    readonly MAX_SELECAO = 4;

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.carregando = true;
        this.erro = '';

        // Carregar todos os brindes
        this.brindeService.listarBrindes().subscribe({
            next: (data: any) => {
                this.brindes = data;
                // Pré-selecionar os brindes que já estão disponíveis para resgate
                this.brindesSelecionados = data
                    .filter((b: any) => b.disponivelParaResgate)
                    .map((b: any) => b._id);
                this.carregando = false;
            },
            error: () => {
                this.erro = 'Erro ao carregar brindes';
                this.carregando = false;
            }
        });
    }

    toggleSelecao(brindeId: string): void {
        const index = this.brindesSelecionados.indexOf(brindeId);

        if (index > -1) {
            // Remover seleção
            this.brindesSelecionados.splice(index, 1);
        } else {
            // Adicionar seleção se não ultrapassar o limite
            if (this.brindesSelecionados.length < this.MAX_SELECAO) {
                this.brindesSelecionados.push(brindeId);
            }
        }
    }

    estaSelecionado(brindeId: string): boolean {
        return this.brindesSelecionados.includes(brindeId);
    }

    podeSelecionar(brindeId: string): boolean {
        return this.estaSelecionado(brindeId) || this.brindesSelecionados.length < this.MAX_SELECAO;
    }

    abrirModalConfirmacao(): void {
        if (this.brindesSelecionados.length === 0) {
            this.erro = 'Selecione pelo menos 1 brinde';
            return;
        }
        this.mostrarModal = true;
    }

    fecharModal(): void {
        this.mostrarModal = false;
    }

    confirmarSelecao(): void {
        this.salvando = true;
        this.erro = '';
        this.mostrarModal = false;

        // Enviar IDs dos brindes selecionados e flag para enviar email
        this.brindeService.atualizarDisponibilidade(this.brindesSelecionados, true).subscribe({
            next: () => {
                this.sucesso = 'Brindes atualizados com sucesso! Emails serão enviados para os apoiadores.';
                this.salvando = false;

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    this.router.navigate(['/adm/brindes']);
                }, 2000);
            },
            error: () => {
                this.erro = 'Erro ao atualizar brindes';
                this.salvando = false;
            }
        });
    }

    getBrindesSelecionadosDetalhes(): any[] {
        return this.brindes.filter(b => this.brindesSelecionados.includes(b._id));
    }

    cancelar(): void {
        this.router.navigate(['/adm/brindes']);
    }
}
