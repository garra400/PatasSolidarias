import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  errorMessage = '';
  successMessage = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Pegar o token da URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      
      if (!token) {
        this.isLoading = false;
        this.errorMessage = 'Token de confirmação não encontrado na URL.';
        return;
      }

      // Confirmar email
      this.confirmEmail(token);
    });
  }

  confirmEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMessage = response.message || 'Email confirmado com sucesso!';
        
        // Redirecionar para home após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.errorMessage = error.error?.message || 'Erro ao confirmar email. O token pode estar inválido ou expirado.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
