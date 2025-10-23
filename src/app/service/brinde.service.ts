import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brinde } from '../model/brinde.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BrindeService {
    private apiUrl = `${environment.apiUrl}/brindes`;

    constructor(private http: HttpClient) { }

    // Listar brindes
    listarBrindes(params?: { disponiveis?: boolean; limit?: number }): Observable<{
        brindes: Brinde[];
        total: number;
    }> {
        let httpParams = new HttpParams();
        if (params?.disponiveis !== undefined) {
            httpParams = httpParams.set('disponiveis', params.disponiveis.toString());
        }
        if (params?.limit) {
            httpParams = httpParams.set('limit', params.limit.toString());
        }

        return this.http.get<{
            brindes: Brinde[];
            total: number;
        }>(this.apiUrl, { params: httpParams });
    }

    // Buscar brinde por ID
    buscarBrindePorId(id: string): Observable<Brinde> {
        return this.http.get<Brinde>(`${this.apiUrl}/${id}`);
    }

    // Criar brinde
    criarBrinde(brinde: Partial<Brinde>, foto: File): Observable<{
        message: string;
        brinde: Brinde;
    }> {
        const formData = new FormData();
        formData.append('foto', foto);
        formData.append('nome', brinde.nome || '');
        formData.append('descricao', brinde.descricao || '');
        formData.append('disponivelParaResgate', brinde.disponivelParaResgate ? 'true' : 'false');
        formData.append('ordem', (brinde.ordem || 0).toString());

        return this.http.post<{
            message: string;
            brinde: Brinde;
        }>(this.apiUrl, formData);
    }

    // Atualizar brinde
    atualizarBrinde(id: string, brinde: Partial<Brinde>, foto?: File): Observable<{
        message: string;
        brinde: Brinde;
    }> {
        const formData = new FormData();

        if (foto) {
            formData.append('foto', foto);
        }

        if (brinde.nome) formData.append('nome', brinde.nome);
        if (brinde.descricao) formData.append('descricao', brinde.descricao);
        if (brinde.disponivelParaResgate !== undefined) {
            formData.append('disponivelParaResgate', brinde.disponivelParaResgate ? 'true' : 'false');
        }
        if (brinde.ordem !== undefined) {
            formData.append('ordem', brinde.ordem.toString());
        }

        return this.http.put<{
            message: string;
            brinde: Brinde;
        }>(`${this.apiUrl}/${id}`, formData);
    }

    // Atualizar disponibilidade em lote
    atualizarDisponibilidade(brindesIds: string[], enviarEmail: boolean = false): Observable<{
        message: string;
        brindes: Brinde[];
    }> {
        return this.http.put<{
            message: string;
            brindes: Brinde[];
        }>(`${this.apiUrl}/batch/disponibilidade`, {
            brindesIds,
            enviarEmail
        });
    }

    // Deletar brinde
    deletarBrinde(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
