import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  token = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetPasswordForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Pegar token da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      
      if (!this.token) {
        this.errorMessage = 'Token inválido. Solicite um novo link de recuperação.';
      }
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const senha = group.get('novaSenha')?.value;
    const confirmar = group.get('confirmarSenha')?.value;
    
    if (senha && confirmar && senha !== confirmar) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && !this.isLoading && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const novaSenha = this.resetPasswordForm.value.novaSenha;

      this.authService.resetPassword({ token: this.token, novaSenha }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Senha redefinida com sucesso!';
          this.resetPasswordForm.reset();
          
          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao redefinir senha. Token pode ter expirado.';
        }
      });
    }
  }

  get formErrors() {
    return {
      novaSenha: this.resetPasswordForm.get('novaSenha')?.errors,
      confirmarSenha: this.resetPasswordForm.get('confirmarSenha')?.errors,
      passwordMismatch: this.resetPasswordForm.errors?.['passwordMismatch']
    };
  }
}
