import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfiguracoesComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any = null;
  isLoadingProfile = false;
  isLoadingPassword = false;
  successMessage = '';
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.profileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.profileForm.patchValue({
          nome: user.nome,
          email: user.email,
          telefone: user.telefone || '',
          cpf: user.cpf || ''
        });
        this.cdr.markForCheck();
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoadingProfile = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      // Simular atualização - substituir por chamada à API
      setTimeout(() => {
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.isLoadingProfile = false;
        this.cdr.markForCheck();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }, 1000);
    }
  }

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const { novaSenha, confirmarSenha } = this.passwordForm.value;
      
      if (novaSenha !== confirmarSenha) {
        this.errorMessage = 'As senhas não coincidem';
        this.cdr.markForCheck();
        return;
      }

      this.isLoadingPassword = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      // Simular atualização - substituir por chamada à API
      setTimeout(() => {
        this.successMessage = 'Senha alterada com sucesso!';
        this.isLoadingPassword = false;
        this.passwordForm.reset();
        this.cdr.markForCheck();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }, 1000);
    }
  }
}
