import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';

interface BrindeDisponivel {
  id: number;
  nome: string;
  descricao: string;
  imagemUrl: string;
  mesReferencia: string;
  status: 'disponivel' | 'resgatado';
}

@Component({
  selector: 'app-meus-brindes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meus-brindes.component.html',
  styleUrl: './meus-brindes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeusBrindesComponent implements OnInit {
  currentUser: User | null = null;
  totalMesesApoio: number = 0;
  brindesDisponiveis: number = 0;
  brindes: BrindeDisponivel[] = [];
  
  // Brindes do mês atual (mock - virá do backend)
  brindesDoMes: BrindeDisponivel[] = [
    {
      id: 1,
      nome: 'Adesivo Exclusivo - Outubro',
      descricao: 'Adesivo especial com a arte dos nossos pets',
      imagemUrl: 'https://via.placeholder.com/150/7c3aed/ffffff?text=Adesivo+Out',
      mesReferencia: '2025-10',
      status: 'disponivel'
    }
  ];

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.calcularBrindes(user);
      }
      this.cdr.markForCheck();
    });
  }

  private calcularBrindes(user: User): void {
    // Calcular total de meses de apoio
    this.totalMesesApoio = user.totalMesesApoio || 0;
    
    // Calcular quantos brindes tem direito (1 brinde a cada 3 meses)
    this.brindesDisponiveis = Math.floor(this.totalMesesApoio / 3);
    
    // Gerar lista de brindes disponíveis (mock - virá do backend)
    this.brindes = [];
    for (let i = 0; i < this.brindesDisponiveis; i++) {
      this.brindes.push({
        id: i + 1,
        nome: `Brinde ${i + 1}`,
        descricao: 'Brinde especial por 3 meses de apoio',
        imagemUrl: `https://via.placeholder.com/150/7c3aed/ffffff?text=Brinde+${i + 1}`,
        mesReferencia: '',
        status: 'disponivel'
      });
    }
  }
}
