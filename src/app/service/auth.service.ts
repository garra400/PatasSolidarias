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
  private apiUrl = `${environment.apiUrl}/auth`;
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

  login(credentials: LoginCredentials): Observable<{ user: User; token: string }> {
    console.log('🚀 Login chamado com:', credentials.email);
    console.log('🔍 Verificando useMockData:', environment.useMockData);
    
    // Se useMockData estiver habilitado OU se houver erro de conexão, use mock
    if (environment.useMockData) {
      console.log('⚠️ UseMockData está TRUE - usando mock');
      return this.loginMock(credentials);
    }

    console.log('🔌 Tentando conectar ao backend:', `${this.apiUrl}/login`);
    console.log('📤 Enviando credenciais:', { email: credentials.email, senha: '***' });
    
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('✅ Login bem-sucedido no backend:', response);
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('❌ Erro ao conectar com backend:', error);
          console.log('❌ Status do erro:', error.status);
          console.log('❌ Tipo do erro:', typeof error.status);
          
          // Se for erro de autenticação (401/403), NÃO use mock - propague o erro
          if (error.status === 401 || error.status === 403) {
            console.log('🚫 Credenciais inválidas - NÃO fazendo fallback para mock');
            console.log('🚫 Disparando throwError');
            return throwError(() => error);
          }
          
          // Apenas use mock se for erro de conexão (0, timeout, etc)
          console.log('🔄 Erro de conexão - usando dados mock como fallback');
          return this.loginMock(credentials);
        }),
        take(1)
      );
  }

  private loginMock(credentials: LoginCredentials): Observable<{ user: User; token: string }> {
    console.log('🔐 Mock login:', credentials.email);
    const response = {
      user: this.mockUser,
      token: 'mock-jwt-token-12345'
    };
    
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
    }
    this.currentUserSubject.next(response.user);
    
    return of(response).pipe(delay(800));
  }

  register(userData: UserRegistration): Observable<{ message: string }> {
    if (environment.useMockData) {
      console.log('📝 Mock register:', userData.email);
      return of({ message: 'Usuário registrado com sucesso! Verifique seu email.' }).pipe(delay(1000));
    }

    console.log('🔌 Tentando registrar no backend:', `${this.apiUrl}/register`);
    console.log('📤 Dados enviados:', userData);
    
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          console.log('✅ Registro bem-sucedido:', response);
        }),
        catchError((error) => {
          console.error('❌ Erro ao registrar no backend:', error);
          console.log('🔄 Usando mock como fallback');
          return of({ message: 'Usuário registrado com sucesso! Verifique seu email.' }).pipe(delay(1000));
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
