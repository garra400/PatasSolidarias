import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfoAssinante, EstatisticasApoiadores } from '../model/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AssinanteService {
    private apiUrl = `${environment.apiUrl}/assinantes`;

    constructor(private http: HttpClient) { }

    // Listar assinantes
    listarAssinantes(params?: {
        status?: 'ativa' | 'cancelada';
        limit?: number;
        skip?: number;
        ordenarPor?: 'dataCriacao' | 'nome' | 'totalMesesApoio';
    }): Observable<{
        assinantes: InfoAssinante[];
        total: number;
        hasMore: boolean;
    }> {
        let httpParams = new HttpParams();

        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.skip) httpParams = httpParams.set('skip', params.skip.toString());
        if (params?.ordenarPor) httpParams = httpParams.set('ordenarPor', params.ordenarPor);

        return this.http.get<{
            assinantes: InfoAssinante[];
            total: number;
            hasMore: boolean;
        }>(this.apiUrl, { params: httpParams });
    }

    // Buscar assinante por ID
    buscarAssinantePorId(id: string): Observable<InfoAssinante> {
        return this.http.get<InfoAssinante>(`${this.apiUrl}/${id}`);
    }

    // Buscar estatísticas gerais
    buscarEstatisticasGerais(): Observable<EstatisticasApoiadores> {
        return this.http.get<EstatisticasApoiadores>(`${this.apiUrl}/stats/geral`);
    }

    // Buscar apoiadores por dia específico
    buscarApoiadoresPorDia(data: string): Observable<{
        data: string;
        total: number;
        apoiadores: InfoAssinante[];
    }> {
        const params = new HttpParams().set('data', data);

        return this.http.get<{
            data: string;
            total: number;
            apoiadores: InfoAssinante[];
        }>(`${this.apiUrl}/stats/por-dia`, { params });
    }
}
