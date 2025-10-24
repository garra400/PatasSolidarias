import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrindeService } from '@services/brinde.service';

@Component({
    selector: 'app-form-brinde',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-brinde.component.html',
    styleUrls: ['./form-brinde.component.scss']
})
export class FormBrindeComponent implements OnInit {
    form!: FormGroup;
    isEdicao = false;
    brindeId?: string;
    carregando = false;
    erro = '';
    sucesso = '';
    foto: File | null = null;
    preview: string | null = null;

    private fb = inject(FormBuilder);
    private brindeService = inject(BrindeService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.form = this.fb.group({
            nome: ['', Validators.required],
            ordem: [0, [Validators.required, Validators.min(0)]],
            descricao: ['', Validators.required],
            quantidadeDisponivel: [null],
            ativo: [true]
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdicao = true;
                this.brindeId = params['id'];
                this.carregar(params['id']);
            }
        });
    }

    carregar(id: string): void {
        this.brindeService.buscarBrindePorId(id).subscribe({
            next: (data: any) => {
                this.form.patchValue(data);
                this.preview = data.fotoUrl;
            },
            error: () => this.erro = 'Erro ao carregar brinde'
        });
    }

    onFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.foto = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => this.preview = e.target?.result as string;
            reader.readAsDataURL(this.foto);
        }
    }

    salvar(): void {
        if (this.form.invalid) return;
        this.carregando = true;

        let obs;
        if (this.isEdicao && this.brindeId) {
            obs = this.brindeService.atualizarBrinde(this.brindeId, this.form.value, this.foto || undefined);
        } else {
            if (!this.foto) {
                this.erro = 'Foto é obrigatória para criar novo brinde';
                this.carregando = false;
                return;
            }
            obs = this.brindeService.criarBrinde(this.form.value, this.foto);
        }

        obs.subscribe({
            next: () => {
                this.sucesso = 'Brinde salvo!';
                setTimeout(() => this.router.navigate(['/adm/brindes/lista']), 1500);
            },
            error: () => {
                this.erro = 'Erro ao salvar';
                this.carregando = false;
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/adm/brindes/lista']);
    }
}
