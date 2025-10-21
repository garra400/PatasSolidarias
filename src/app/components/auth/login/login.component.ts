import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log('🎯 onSubmit chamado - iniciando login');

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('✅ Login Component - sucesso:', response);
          this.isLoading = false;
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.user.isDoador) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/seja-padrinho']);
          }
        },
        error: (error: any) => {
          console.log('❌ Login Component - erro capturado:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
          console.log('❌ errorMessage definido como:', this.errorMessage);
          console.log('❌ isLoading definido como:', this.isLoading);
          this.cdr.markForCheck();
          console.log('🔄 Change detection marcada');
        },
        complete: () => {
          console.log('🏁 Observable completado');
        }
      });
    } else {
      console.log('⚠️ Formulário inválido ou já está processando');
    }
  }
}
