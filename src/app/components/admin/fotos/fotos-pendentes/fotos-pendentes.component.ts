import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FotoService } from '@services/foto.service';
import { Foto } from '@models/animal.model';

@Component({
    selector: 'app-fotos-pendentes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './fotos-pendentes.component.html',
    styleUrls: ['./fotos-pendentes.component.scss']
})
export class FotosPendentesComponent implements OnInit {
    private fotoService = inject(FotoService);

    fotosPendentes: Foto[] = [];
    fotosSelecionadas: Set<string> = new Set();
    carregando = true;
    enviandoEmail = false;
    erro = '';
    sucesso = '';

    ngOnInit(): void {
        this.carregarFotosPendentes();
    }

    carregarFotosPendentes(): void {
        this.carregando = true;
        this.erro = '';

        this.fotoService.listarFotos({ status: 'pendente' }).subscribe({
            next: (response) => {
                this.fotosPendentes = response.fotos;
                this.carregando = false;
            },
            error: (err) => {
                console.error('Erro ao carregar fotos pendentes:', err);
                this.erro = 'Erro ao carregar fotos pendentes';
                this.carregando = false;
            }
        });
    }

    toggleSelecionarFoto(fotoId: string): void {
        if (this.fotosSelecionadas.has(fotoId)) {
            this.fotosSelecionadas.delete(fotoId);
        } else {
            this.fotosSelecionadas.add(fotoId);
        }
    }

    selecionarTodas(): void {
        if (this.todasSelecionadas) {
            this.fotosSelecionadas.clear();
        } else {
            this.fotosPendentes.forEach(foto => {
                if (foto.id) this.fotosSelecionadas.add(foto.id);
            });
        }
    }

    get todasSelecionadas(): boolean {
        return this.fotosPendentes.length > 0 &&
            this.fotosSelecionadas.size === this.fotosPendentes.length;
    }

    get algumaSelecionada(): boolean {
        return this.fotosSelecionadas.size > 0;
    }

    dispararNotificacoes(): void {
        if (!this.algumaSelecionada) {
            this.erro = 'Selecione pelo menos uma foto';
            return;
        }

        const confirmar = confirm(
            `Deseja publicar ${this.fotosSelecionadas.size} foto(s) e enviar notificações para TODOS os usuários?`
        );

        if (!confirmar) return;

        this.enviandoEmail = true;
        this.erro = '';
        this.sucesso = '';

        const fotosIds = Array.from(this.fotosSelecionadas);

        this.fotoService.publicarFotos(fotosIds).subscribe({
            next: (response) => {
                this.sucesso = response.message || 'Fotos publicadas e notificações enviadas com sucesso!';
                this.enviandoEmail = false;
                this.fotosSelecionadas.clear();

                // Recarregar lista
                setTimeout(() => {
                    this.carregarFotosPendentes();
                }, 2000);
            },
            error: (err) => {
                console.error('Erro ao publicar fotos:', err);
                this.erro = err.error?.message || 'Erro ao publicar fotos e enviar notificações';
                this.enviandoEmail = false;
            }
        });
    }

    deletarFoto(fotoId: string): void {
        if (!confirm('Tem certeza que deseja deletar esta foto?')) return;

        this.fotoService.deletarFoto(fotoId).subscribe({
            next: () => {
                this.sucesso = 'Foto deletada com sucesso!';
                this.carregarFotosPendentes();

                setTimeout(() => {
                    this.sucesso = '';
                }, 3000);
            },
            error: (err) => {
                console.error('Erro ao deletar foto:', err);
                this.erro = 'Erro ao deletar foto';
            }
        });
    }

    getFotoUrl(foto: Foto): string {
        return foto.url || '/images/foto-placeholder.svg';
    }

    getNomesAnimais(foto: Foto): string {
        if (!foto.animais || foto.animais.length === 0) {
            return 'Sem animais associados';
        }
        return foto.animais.map(a => a.nome).join(', ');
    }
}
