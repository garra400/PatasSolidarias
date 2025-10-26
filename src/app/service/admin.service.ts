import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { ConviteAdmin, UserAdmin, AdminPermissoes } from '../model/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = `${environment.apiUrl}/admin`;

    // Observable para status de admin
    private isAdminSubject = new BehaviorSubject<boolean>(false);
    private permissoesSubject = new BehaviorSubject<AdminPermissoes | null>(null);

    isAdmin$ = this.isAdminSubject.asObservable();
    permissoes$ = this.permissoesSubject.asObservable();

    constructor(private http: HttpClient) {
        // Aguardar o token estar disponível antes de verificar status de admin
        setTimeout(() => {
            const token = localStorage.getItem('token');
            if (token) {
                this.verificarAdmin().subscribe({
                    error: (err) => {
                        // Não fazer nada em caso de erro 401 - apenas não marcar como admin
                        if (err.status === 401) {
                            console.log('Usuário não é admin ou token inválido');
                        }
                    }
                });
            }
        }, 200);
    }    // Verificar se usuário é admin
    verificarAdmin(): Observable<{
        isAdmin: boolean;
        permissoes: AdminPermissoes;
    }> {
        return this.http.get<{
            isAdmin: boolean;
            permissoes: AdminPermissoes;
        }>(`${this.apiUrl}/check`).pipe(
            tap(response => {
                this.isAdminSubject.next(response.isAdmin);
                this.permissoesSubject.next(response.permissoes);
            }),
            catchError(error => {
                // Se receber 401, significa que não é admin ou token inválido
                if (error.status === 401) {
                    this.isAdminSubject.next(false);
                    this.permissoesSubject.next(null);
                }
                // Não propagar o erro para evitar quebrar a aplicação
                return of({ isAdmin: false, permissoes: this.getPermissoesPadrao() });
            })
        );
    }    // Verificar se tem permissão específica
    temPermissao(permissao: keyof AdminPermissoes): boolean {
        const permissoes = this.permissoesSubject.value;
        return permissoes ? permissoes[permissao] : false;
    }

    // CONVITES ADMIN

    // Listar convites
    listarConvites(status?: 'pendente' | 'aceito' | 'expirado' | 'cancelado'): Observable<{
        convites: ConviteAdmin[];
    }> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);

        return this.http.get<{
            convites: ConviteAdmin[];
        }>(`${this.apiUrl}/convites`, { params });
    }

    // Criar convite
    criarConvite(emailConvidado: string, permissoes: AdminPermissoes): Observable<{
        message: string;
        convite: ConviteAdmin;
    }> {
        return this.http.post<{
            message: string;
            convite: ConviteAdmin;
        }>(`${this.apiUrl}/convites`, { emailConvidado, permissoes });
    }

    // Verificar convite por token
    verificarConvite(token: string): Observable<{
        convite: {
            emailConvidado: string;
            convidadoPor: any;
            permissoes: AdminPermissoes;
            dataExpiracao: Date;
        };
    }> {
        return this.http.get<{
            convite: {
                emailConvidado: string;
                convidadoPor: any;
                permissoes: AdminPermissoes;
                dataExpiracao: Date;
            };
        }>(`${this.apiUrl}/convites/verificar/${token}`);
    }

    // Aceitar convite
    aceitarConvite(token: string): Observable<{
        message: string;
        permissoes: AdminPermissoes;
    }> {
        return this.http.post<{
            message: string;
            permissoes: AdminPermissoes;
        }>(`${this.apiUrl}/convites/aceitar/${token}`, {}).pipe(
            tap(response => {
                this.isAdminSubject.next(true);
                this.permissoesSubject.next(response.permissoes);
            })
        );
    }

    // Cancelar convite
    cancelarConvite(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/convites/${id}`);
    }

    // GERENCIAMENTO DE ADMINS

    // Listar admins
    listarAdmins(): Observable<{
        admins: UserAdmin[];
    }> {
        return this.http.get<{
            admins: UserAdmin[];
        }>(`${this.apiUrl}/lista`);
    }

    // Atualizar permissões de admin
    atualizarPermissoes(id: string, permissoes: AdminPermissoes): Observable<{
        message: string;
        admin: {
            nome: string;
            email: string;
            permissoes: AdminPermissoes;
        };
    }> {
        return this.http.put<{
            message: string;
            admin: {
                nome: string;
                email: string;
                permissoes: AdminPermissoes;
            };
        }>(`${this.apiUrl}/permissoes/${id}`, { permissoes });
    }

    // Remover admin
    removerAdmin(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    // Limpar estado (usado no logout)
    limparEstado(): void {
        this.isAdminSubject.next(false);
        this.permissoesSubject.next(null);
    }

    // Retornar permissões padrão (sem permissões)
    private getPermissoesPadrao(): AdminPermissoes {
        return {
            gerenciarAnimais: false,
            gerenciarFotos: false,
            gerenciarBrindes: false,
            gerenciarPosts: false,
            visualizarAssinantes: false,
            convidarAdmins: false,
            gerenciarConfiguracoes: false
        };
    }
}
