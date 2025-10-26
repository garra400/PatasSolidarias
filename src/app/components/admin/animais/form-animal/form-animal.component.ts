import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalService } from '@services/animal.service';
import { FotoService } from '@services/foto.service';
import { SelecionarFotoPerfilModalComponent } from '../selecionar-foto-perfil-modal/selecionar-foto-perfil-modal.component';
import { Animal, Foto } from '@models/animal.model';
import { ImageUrlHelper } from '../../../../utils/image-url.helper';

@Component({
    selector: 'app-form-animal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelecionarFotoPerfilModalComponent],
    templateUrl: './form-animal.component.html',
    styleUrls: ['./form-animal.component.scss']
})
export class FormAnimalComponent implements OnInit {
    form!: FormGroup;
    isEdicao = false;
    animalId?: string;
    carregando = false;
    erro = '';
    sucesso = '';

    fotoSelecionada: File | null = null;
    previewUrl: string | null = null;

    animalAtual?: Animal;
    mostrarModalTrocarFoto = false;

    protected getFullImageUrl = ImageUrlHelper.getFullImageUrl;

    private fb = inject(FormBuilder);
    private animalService = inject(AnimalService);
    private fotoService = inject(FotoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.criarFormulario();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdicao = true;
                this.animalId = params['id'];
                this.carregarAnimal(params['id']);
            }
        });
    }

    criarFormulario(): void {
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(2)]],
            tipo: ['cachorro', Validators.required],
            idade: ['', [Validators.min(0)]], // Removido required
            descricao: ['', [Validators.required, Validators.minLength(10)]],
            ativo: [true]
        });
    }

    carregarAnimal(id: string): void {
        this.carregando = true;
        this.animalService.getAnimalById(id).subscribe({
            next: (animal: any) => {
                this.animalAtual = animal;
                this.form.patchValue({
                    nome: animal.nome,
                    tipo: animal.tipo,
                    idade: animal.idade,
                    descricao: animal.descricao,
                    ativo: animal.ativo !== undefined ? animal.ativo : true
                });

                // Atualizar preview com foto de perfil
                // O backend pode retornar fotoPerfilId populado como objeto (fotoPerfil)
                // ou como string ID, ou pode ter fotoUrl diretamente
                if (animal.fotoUrl) {
                    // URL direta configurada no backend
                    this.previewUrl = ImageUrlHelper.getFullImageUrl(animal.fotoUrl);
                } else if (animal.fotoPerfilId && typeof animal.fotoPerfilId === 'object' && animal.fotoPerfilId.url) {
                    // fotoPerfilId populado (objeto Foto)
                    this.previewUrl = ImageUrlHelper.getFullImageUrl(animal.fotoPerfilId.url);
                } else if (animal.fotoPerfil?.url) {
                    // Campo fotoPerfil separado
                    this.previewUrl = ImageUrlHelper.getFullImageUrl(animal.fotoPerfil.url);
                }

                this.carregando = false;
            },
            error: (err: any) => {
                console.error('Erro ao carregar animal:', err);
                this.erro = 'Erro ao carregar dados do animal';
                this.carregando = false;
            }
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                this.erro = 'Por favor, selecione uma imagem válida';
                return;
            }

            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.erro = 'A imagem deve ter no máximo 5MB';
                return;
            }

            this.fotoSelecionada = file;

            // Preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    salvar(): void {
        if (this.form.invalid) {
            this.erro = 'Por favor, preencha todos os campos obrigatórios';
            return;
        }

        this.carregando = true;
        this.erro = '';
        this.sucesso = '';

        const formData = new FormData();

        // Adicionar campos do formulário
        Object.keys(this.form.value).forEach(key => {
            const value = this.form.value[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        // Adicionar foto se selecionada
        if (this.fotoSelecionada) {
            formData.append('fotoPerfil', this.fotoSelecionada);
        }

        if (this.isEdicao && this.animalId) {
            // Atualizar animal
            this.animalService.updateAnimal(this.animalId, formData).subscribe({
                next: () => {
                    this.sucesso = 'Animal atualizado com sucesso!';
                    this.carregando = false;
                    setTimeout(() => this.router.navigate(['/adm/animais']), 1500);
                },
                error: (err: any) => {
                    console.error('Erro ao atualizar animal:', err);
                    this.erro = 'Erro ao atualizar animal';
                    this.carregando = false;
                }
            });
        } else {
            // Criar novo animal
            this.animalService.createAnimal(formData).subscribe({
                next: (response: any) => {
                    this.sucesso = 'Animal criado com sucesso!';
                    this.carregando = false;
                    setTimeout(() => this.router.navigate(['/adm/animais']), 1500);
                },
                error: (err: any) => {
                    console.error('Erro ao criar animal:', err);
                    this.erro = 'Erro ao criar animal';
                    this.carregando = false;
                }
            });
        }
    }

    cancelar(): void {
        if (confirm('Deseja realmente cancelar? As alterações não salvas serão perdidas.')) {
            this.router.navigate(['/adm/animais']);
        }
    }

    abrirModalTrocarFoto(): void {
        this.mostrarModalTrocarFoto = true;
    }

    fecharModalTrocarFoto(): void {
        this.mostrarModalTrocarFoto = false;
    }

    onFotoPerfilAlterada(foto: Foto): void {
        this.previewUrl = ImageUrlHelper.getFullImageUrl(foto.url);
        this.sucesso = 'Foto de perfil atualizada com sucesso!';
        setTimeout(() => {
            this.sucesso = '';
        }, 3000);
    }

    /**
     * Obtém o ID da foto de perfil atual do animal
     * Trata tanto o caso de fotoPerfilId ser uma string quanto um objeto populado
     */
    getFotoPerfilId(): string | undefined {
        if (!this.animalAtual) return undefined;

        // Se fotoPerfilId é um objeto (populado), pega o _id
        if (this.animalAtual.fotoPerfilId && typeof this.animalAtual.fotoPerfilId === 'object') {
            return (this.animalAtual.fotoPerfilId as any)._id || (this.animalAtual.fotoPerfilId as any).id;
        }

        // Se fotoPerfilId é uma string, retorna diretamente
        if (typeof this.animalAtual.fotoPerfilId === 'string') {
            return this.animalAtual.fotoPerfilId;
        }

        // Fallback: tenta fotoPerfil
        if (this.animalAtual.fotoPerfil) {
            return this.animalAtual.fotoPerfil.id;
        }

        return undefined;
    }
}
