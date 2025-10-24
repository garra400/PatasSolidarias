import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BrindeService } from '@services/brinde.service';

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
                this.brindes = data;
                this.carregando = false;
            },
            error: (err: any) => {
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
        this.carregando = true;
        this.brindeService.deletarBrinde(id).subscribe({
            next: () => {
                this.sucesso = 'Brinde deletado com sucesso!';
                setTimeout(() => this.sucesso = '', 3000);
                this.carregar();
            },
            error: () => {
                this.erro = 'Erro ao deletar brinde';
                this.carregando = false;
            }
        });
    }
}
