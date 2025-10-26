import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
    loginForm: FormGroup;
    erro: string = '';
    carregando: boolean = false;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.erro = 'Por favor, preencha todos os campos corretamente';
            return;
        }

        this.carregando = true;
        this.erro = '';

        const { email, senha } = this.loginForm.value;

        this.authService.login({ email, senha }).subscribe({
            next: (response: any) => {
                // Verificar se é admin
                if (response.user?.role === 'admin') {
                    this.router.navigate(['/adm/dashboard']);
                } else {
                    this.erro = 'Acesso negado. Esta área é exclusiva para administradores.';
                    this.authService.logout();
                    this.carregando = false;
                }
            },
            error: (err: any) => {
                console.error('Erro no login:', err);
                this.erro = err.error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
                this.carregando = false;
            }
        });
    }

    voltarParaSite(): void {
        this.router.navigate(['/']);
    }
}
