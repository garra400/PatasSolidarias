import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '@services/post.service';

@Component({
    selector: 'app-editor-post',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container">
      <h1>{{ isEdicao ? 'Editar' : 'Novo' }} Post</h1>
      <form [formGroup]="form" class="form">
        <div class="group">
          <label>Título *</label>
          <input type="text" formControlName="titulo" class="control">
        </div>
        
        <div class="group">
          <label>Conteúdo *</label>
          
          <!-- Rich Text Toolbar -->
          <div class="editor-toolbar">
            <button type="button" (click)="execCommand('bold')" class="toolbar-btn" title="Negrito"><b>B</b></button>
            <button type="button" (click)="execCommand('italic')" class="toolbar-btn" title="Itálico"><i>I</i></button>
            <button type="button" (click)="execCommand('underline')" class="toolbar-btn" title="Sublinhado"><u>U</u></button>
            <span class="separator"></span>
            <button type="button" (click)="execCommand('justifyLeft')" class="toolbar-btn" title="Esquerda">≡</button>
            <button type="button" (click)="execCommand('justifyCenter')" class="toolbar-btn" title="Centro">≣</button>
            <button type="button" (click)="execCommand('justifyRight')" class="toolbar-btn" title="Direita">≡</button>
            <span class="separator"></span>
            <button type="button" (click)="execCommand('insertUnorderedList')" class="toolbar-btn" title="Lista">• Lista</button>
            <button type="button" (click)="execCommand('insertOrderedList')" class="toolbar-btn" title="Lista Numerada">1. Numerada</button>
            <span class="separator"></span>
            <button type="button" (click)="insertLink()" class="toolbar-btn" title="Link">🔗</button>
            <button type="button" (click)="insertImage()" class="toolbar-btn" title="Imagem">🖼️</button>
          </div>
          
          <!-- ContentEditable Editor -->
          <div 
            #editor
            class="rich-editor" 
            contenteditable="true"
            (input)="onContentChange($event)"
            [innerHTML]="editorContent"></div>
          
          <textarea formControlName="conteudoHtml" class="hidden-textarea"></textarea>
        </div>
        
        <div class="group">
          <label>Destinatários *</label>
          <select formControlName="destinatarios" class="control">
            <option value="todos">Todos</option>
            <option value="apoiadores">Apenas Apoiadores</option>
          </select>
        </div>
        
        <div class="actions">
          <button type="button" (click)="cancelar()" class="btn-secondary">Cancelar</button>
          <button type="button" (click)="salvar(false)" class="btn-secondary" [disabled]="form.invalid">Salvar Rascunho</button>
          <button type="button" (click)="salvar(true)" class="btn-primary" [disabled]="form.invalid">Salvar e Enviar</button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
    .form { background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .group { margin-bottom: 1.5rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit; }
    
    .editor-toolbar {
      display: flex;
      gap: 0.25rem;
      padding: 0.5rem;
      background: #f7fafc;
      border: 2px solid #e2e8f0;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      flex-wrap: wrap;
    }
    
    .toolbar-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .toolbar-btn:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
    
    .separator {
      width: 1px;
      background: #cbd5e0;
      margin: 0 0.5rem;
    }
    
    .rich-editor {
      min-height: 300px;
      padding: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 0 0 8px 8px;
      background: white;
      outline: none;
      overflow-y: auto;
      font-family: inherit;
      line-height: 1.6;
    }
    
    .rich-editor:focus {
      border-color: #667eea;
    }
    
    .hidden-textarea {
      display: none;
    }
    
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
    button { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }
  `]
})
export class EditorPostComponent implements OnInit {
    form!: FormGroup;
    isEdicao = false;
    postId?: string;
    editorContent = '';

    private fb = inject(FormBuilder);
    private postService = inject(PostService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.form = this.fb.group({
            titulo: ['', Validators.required],
            conteudoHtml: ['', Validators.required],
            destinatarios: ['todos', Validators.required]
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdicao = true;
                this.postId = params['id'];
                this.postService.buscarPostPorId(params['id']).subscribe({
                    next: (data: any) => {
                        this.form.patchValue(data);
                        this.editorContent = data.conteudoHtml || '';
                    }
                });
            }
        });
    }

    execCommand(command: string): void {
        document.execCommand(command, false);
    }

    insertLink(): void {
        const url = prompt('Digite a URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    insertImage(): void {
        const url = prompt('Digite a URL da imagem:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    onContentChange(event: Event): void {
        const content = (event.target as HTMLElement).innerHTML;
        this.form.patchValue({ conteudoHtml: content });
    }

    salvar(enviar: boolean): void {
        if (this.form.invalid) return;

        const dados = this.form.value;
        const obs = this.isEdicao && this.postId
            ? this.postService.atualizarPost(this.postId, dados)
            : this.postService.criarPost(dados);

        obs.subscribe({
            next: (response: any) => {
                if (enviar && response._id) {
                    this.postService.enviarPost(response._id).subscribe({
                        next: () => {
                            alert('Post salvo e enviado!');
                            this.router.navigate(['/adm/posts/lista']);
                        }
                    });
                } else {
                    alert('Post salvo!');
                    this.router.navigate(['/adm/posts/lista']);
                }
            }
        });
    }

    cancelar(): void {
        this.router.navigate(['/adm/posts/lista']);
    }
}
