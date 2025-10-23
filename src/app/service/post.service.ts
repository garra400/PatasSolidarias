import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../model/post.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = `${environment.apiUrl}/posts`;

    constructor(private http: HttpClient) { }

    // Listar posts
    listarPosts(params?: {
        status?: 'rascunho' | 'enviado';
        limit?: number;
        skip?: number;
    }): Observable<{
        posts: Post[];
        total: number;
        hasMore: boolean;
    }> {
        let httpParams = new HttpParams();

        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
        if (params?.skip) httpParams = httpParams.set('skip', params.skip.toString());

        return this.http.get<{
            posts: Post[];
            total: number;
            hasMore: boolean;
        }>(this.apiUrl, { params: httpParams });
    }

    // Buscar post por ID
    buscarPostPorId(id: string): Observable<Post> {
        return this.http.get<Post>(`${this.apiUrl}/${id}`);
    }

    // Criar post
    criarPost(post: Partial<Post>): Observable<{
        message: string;
        post: Post;
    }> {
        return this.http.post<{
            message: string;
            post: Post;
        }>(this.apiUrl, post);
    }

    // Atualizar post
    atualizarPost(id: string, post: Partial<Post>): Observable<{
        message: string;
        post: Post;
    }> {
        return this.http.put<{
            message: string;
            post: Post;
        }>(`${this.apiUrl}/${id}`, post);
    }

    // Enviar post (newsletter)
    enviarPost(id: string): Observable<{
        message: string;
        post: Post;
    }> {
        return this.http.post<{
            message: string;
            post: Post;
        }>(`${this.apiUrl}/${id}/enviar`, {});
    }

    // Deletar post
    deletarPost(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
