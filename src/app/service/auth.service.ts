import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay, catchError, throwError, take } from 'rxjs';
import { User, LoginCredentials, UserRegistration, PasswordReset } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  // Mock user data
  private mockUser: User = {
    _id: '1',
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    role: 'user',
    isDoador: true,
    emailVerificado: true,
    dataCriacao: new Date('2025-08-01'),
    assinaturaAtiva: {
      tipo: 'mensal',
      valorMensal: 15.00,
      dataInicio: new Date('2025-08-01'),
      dataProximoPagamento: new Date('2025-11-01'),
      status: 'ativa'
    },
    historicoPagamentos: [
      {
        userId: '1',
        tipo: 'assinatura',
        valor: 15.00,
        status: 'aprovado',
        data: new Date('2025-08-01'),
        mercadoPagoId: 'MP-123456',
        mesReferencia: '2025-08'
      },
      {
        userId: '1',
        tipo: 'assinatura',
        valor: 15.00,
        status: 'aprovado',
        data: new Date('2025-09-01'),
        mercadoPagoId: 'MP-123457',
        mesReferencia: '2025-09'
      },
      {
        userId: '1',
        tipo: 'assinatura',
        valor: 15.00,
        status: 'aprovado',
        data: new Date('2025-10-01'),
        mercadoPagoId: 'MP-123458',
        mesReferencia: '2025-10'
      }
    ],
    totalMesesApoio: 3, // 3 meses de assinatura
    brindesDisponiveis: 1 // 3 meses / 3 = 1 brinde
  };

  constructor(private http: HttpClient) {
    console.log('🔧 AuthService inicializado');
    console.log('📊 useMockData:', environment.useMockData);
    console.log('🌐 apiUrl:', this.apiUrl);

    this.isBrowser = isPlatformBrowser(this.platformId);
    const storedUser = this.isBrowser ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; token: string; user: User }> {
    console.log('🚀 Tentando login no backend:', credentials.email);

    return this.http.post<{ success: boolean; token: string; user: User }>(`${this.apiUrl}/login`, {
      email: credentials.email,
      senha: credentials.senha
    }).pipe(
      tap(response => {
        console.log('✅ Login bem-sucedido:', response);
        if (response.success && response.token && response.user) {
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError((error) => {
        console.error('❌ Erro no login:', error);
        // Fallback para mock apenas se backend não estiver disponível
        if (error.status === 0) {
          console.log('⚠️ Backend offline - usando mock');
          return this.loginMock(credentials);
        }
        return throwError(() => error);
      })
    );
  }

  private loginMock(credentials: LoginCredentials): Observable<{ success: boolean; token: string; user: User }> {
    console.log('🔐 Mock login:', credentials.email);
    const response = {
      success: true,
      token: 'mock-jwt-token-12345',
      user: this.mockUser
    };

    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    this.currentUserSubject.next(response.user);

    return of(response).pipe(delay(800));
  }

  register(userData: UserRegistration): Observable<{ success: boolean; message: string }> {
    console.log('� Tentando registrar no backend:', userData.email);

    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/register`, {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      telefone: userData.telefone,
      cpf: userData.cpf
    }).pipe(
      tap(response => {
        console.log('✅ Registro bem-sucedido:', response);
      }),
      catchError((error) => {
        console.error('❌ Erro ao registrar:', error);
        if (error.status === 0) {
          console.log('⚠️ Backend offline - usando mock');
          return of({ success: true, message: 'Usuário registrado com sucesso! Verifique seu email.' }).pipe(delay(1000));
        }
        return throwError(() => error);
      })
    );
  }

  verifyEmail(token: string): Observable<any> {
    if (environment.useMockData) {
      return of({
        message: 'Email verificado com sucesso!',
        user: { id: '1', nome: 'Mock User', email: 'mock@test.com', tipo: 'adotante' },
        token: 'mock-jwt-token'
      }).pipe(delay(500));
    }
    return this.http.post<any>(`${this.apiUrl}/confirm-email`, { token })
      .pipe(
        tap((response) => {
          // Após confirmação bem-sucedida, salvar o usuário e token (login automático)
          if (response.user && response.token && this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            console.log('✅ Email confirmado e login automático realizado');
          }
        })
      );
  }

  requestPasswordReset(email: string): Observable<{ message: string }> {
    if (environment.useMockData) {
      return of({ message: 'Email de recuperação enviado!' }).pipe(delay(500));
    }
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { email });
  }

  resetPassword(resetData: PasswordReset): Observable<{ message: string }> {
    if (environment.useMockData) {
      return of({ message: 'Senha redefinida com sucesso!' }).pipe(delay(500));
    }
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password-confirm`, resetData);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  isDoador(): boolean {
    return this.currentUserValue?.isDoador || false;
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('token') : null;
  }
}
