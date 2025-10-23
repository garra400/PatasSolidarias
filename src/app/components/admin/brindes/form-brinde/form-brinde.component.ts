import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrindeService } from '@services/brinde.service';

@Component({
    selector: 'app-form-brinde',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container">
      <header>
        <h1>{{ isEdicao ? 'Editar Brinde' : 'Novo Brinde' }}</h1>
      </header>

      <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
      <div *ngIf="sucesso" class="alert alert-success">{{ sucesso }}</div>

      <form [formGroup]="form" (ngSubmit)="salvar()" class="form">
        <div class="group">
          <label>Nome *</label>
          <input type="text" formControlName="nome" class="control" placeholder="Nome do brinde">
        </div>

        <div class="group">
          <label>Descrição *</label>
          <textarea formControlName="descricao" class="control" rows="4"></textarea>
        </div>

        <div class="group">
          <label>Foto</label>
          <input type="file" accept="image/*" (change)="onFile($event)" class="control">
          <img *ngIf="preview" [src]="preview" class="preview">
        </div>

        <div class="group">
          <label>
            <input type="checkbox" formControlName="disponivelParaResgate">
            Disponível para resgate
          </label>
        </div>

        <div class="actions">
          <button type="button" (click)="cancelar()" class="btn btn-secondary" [disabled]="carregando">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="carregando || form.invalid">
            {{ carregando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; color: #333; margin-bottom: 2rem; }
    .alert { padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .alert-danger { background-color: #fee; color: #c33; border: 1px solid #fcc; }
    .alert-success { background-color: #efe; color: #3c3; border: 1px solid #cfc; }
    .form { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
    .group { margin-bottom: 1.5rem; }
    label { display: block; font-weight: 600; color: #333; margin-bottom: 0.5rem; }
    .control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; }
    .control:focus { outline: none; border-color: #667eea; }
    .preview { max-width: 200px; margin-top: 1rem; border-radius: 8px; }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }
  `]
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
            descricao: ['', Validators.required],
            disponivelParaResgate: [true]
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
