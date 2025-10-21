import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/shared/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('PataSolidarias');
  protected readonly currentYear = new Date().getFullYear();
  protected showFooter = true;
  
  private router = inject(Router);

  ngOnInit() {
    // Verificar URL inicial
    this.checkFooterVisibility(this.router.url);

    // Monitorar mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkFooterVisibility(event.url);
    });
  }

  private checkFooterVisibility(url: string): void {
    // Ocultar footer nas páginas de autenticação
    const hideFooterRoutes = ['/login', '/registro', '/recuperar-senha'];
    this.showFooter = !hideFooterRoutes.some(route => url.includes(route));
  }
}
