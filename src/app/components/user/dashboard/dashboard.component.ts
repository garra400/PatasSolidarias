import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);

    currentUser: any = null;
    isDoador: boolean = false;
    hasAssinatura: boolean = false;

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.isDoador = user?.isDoador || false;
            this.hasAssinatura = user?.assinaturaAtiva?.status === 'ativa';
        });
    }

    get saudacao(): string {
        const hora = new Date().getHours();
        if (hora < 12) return 'Bom dia';
        if (hora < 18) return 'Boa tarde';
        return 'Boa noite';
    }
}
