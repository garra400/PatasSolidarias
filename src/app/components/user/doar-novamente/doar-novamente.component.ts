import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-doar-novamente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doar-novamente.component.html',
  styleUrl: './doar-novamente.component.scss'
})
export class DoarNovamenteComponent implements OnInit {
  currentUser: any = null;
  hasAssinatura = false;
  isDoadorPix = false;

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.hasAssinatura = user?.assinaturaAtiva?.status === 'ativa';
      this.isDoadorPix = !!(user?.isDoador && !this.hasAssinatura);
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  doarPix(): void {
    // TODO: Integrar com MercadoPago PIX
    alert('Integração com PIX em desenvolvimento');
  }

  assinarPlano(): void {
    // TODO: Integrar com MercadoPago Assinatura
    alert('Integração com Plano Mensal em desenvolvimento');
  }
}
