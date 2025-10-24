import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Foto, FotoUploadBatch } from '../model/animal.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FotoService {
    private apiUrl = `${environment.apiUrl}/fotos`;

    constructor(private http: HttpClient) { }

    // Listar fotos
    listarFotos(params?: { animalId?: string; status?: string; limit?: number; skip?: number }): Observable<{
        fotos: Foto[];
        total: number;
        hasMore: boolean;
    }> {
        let httpParams = new HttpParams();
        if (params?.animalId) httpParams = httpParams.set('animalId', params.animalId);
        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.skip) httpParams = httpParams.set('skip', params.skip.toString());

        return this.http.get<{
            fotos: Foto[];
            total: number;
            hasMore: boolean;
        }>(this.apiUrl, { params: httpParams });
    }

    // Buscar foto por ID
    buscarFotoPorId(id: string): Observable<Foto> {
        return this.http.get<Foto>(`${this.apiUrl}/${id}`);
    }

    // Upload de múltiplas fotos
    uploadFotos(batch: FotoUploadBatch): Observable<{
        message: string;
        fotos: Foto[];
    }> {
        const formData = new FormData();

        // Adicionar arquivos
        batch.fotos.forEach((foto, index) => {
            if (foto.file) {
                formData.append('fotos', foto.file);
            }
        });

        // Adicionar descrições
        const descricoes = batch.fotos.map(f => f.descricao || '');
        formData.append('descricoes', JSON.stringify(descricoes));

        // Adicionar animais IDs
        const animaisIds = batch.fotos.map(f => f.animaisIds || []);
        formData.append('animaisIds', JSON.stringify(animaisIds));

        // Enviar email?
        formData.append('enviarEmail', batch.enviarEmail ? 'true' : 'false');

        return this.http.post<{
            message: string;
            fotos: Foto[];
        }>(`${this.apiUrl}/batch`, formData);
    }

    // Atualizar foto
    atualizarFoto(id: string, foto: Partial<Foto>): Observable<{
        message: string;
        foto: Foto;
    }> {
        return this.http.put<{
            message: string;
            foto: Foto;
        }>(`${this.apiUrl}/${id}`, foto);
    }

    // Deletar foto
    deletarFoto(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    // Publicar fotos (marcar como publicadas e enviar email)
    publicarFotos(fotosIds: string[]): Observable<{
        message: string;
        fotosPublicadas: number;
        emailsEnviados: number;
    }> {
        return this.http.post<{
            message: string;
            fotosPublicadas: number;
            emailsEnviados: number;
        }>(`${this.apiUrl}/publicar`, { fotosIds });
    }
}
