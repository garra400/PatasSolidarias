import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoResgate, SolicitacaoResgate } from '../model/brinde.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResgateService {
    private apiUrl = `${environment.apiUrl}/resgates`;

    constructor(private http: HttpClient) { }

    // Buscar configuração de resgate
    buscarConfiguracao(): Observable<ConfiguracaoResgate> {
        return this.http.get<ConfiguracaoResgate>(`${this.apiUrl}/configuracao`);
    }

    // Atualizar configuração (admin)
    atualizarConfiguracao(config: Partial<ConfiguracaoResgate>): Observable<{
        message: string;
        config: ConfiguracaoResgate;
    }> {
        return this.http.put<{
            message: string;
            config: ConfiguracaoResgate;
        }>(`${this.apiUrl}/configuracao`, config);
    }

    // Listar solicitações
    listarSolicitacoes(params?: {
        status?: 'pendente' | 'confirmado' | 'cancelado' | 'retirado';
        dataInicio?: string;
        dataFim?: string;
    }): Observable<{
        solicitacoes: SolicitacaoResgate[];
    }> {
        let httpParams = new HttpParams();

        if (params?.status) httpParams = httpParams.set('status', params.status);
        if (params?.dataInicio) httpParams = httpParams.set('dataInicio', params.dataInicio);
        if (params?.dataFim) httpParams = httpParams.set('dataFim', params.dataFim);

        return this.http.get<{
            solicitacoes: SolicitacaoResgate[];
        }>(`${this.apiUrl}/solicitacoes`, { params: httpParams });
    }

    // Criar solicitação de resgate
    criarSolicitacao(solicitacao: {
        brindeId: string;
        dataHorarioEscolhido: Date;
        observacoes?: string;
    }): Observable<{
        message: string;
        solicitacao: SolicitacaoResgate;
    }> {
        return this.http.post<{
            message: string;
            solicitacao: SolicitacaoResgate;
        }>(`${this.apiUrl}/solicitacoes`, solicitacao);
    }

    // Atualizar status da solicitação (admin)
    atualizarStatusSolicitacao(
        id: string,
        status: 'pendente' | 'confirmado' | 'cancelado' | 'retirado',
        observacoes?: string
    ): Observable<{
        message: string;
        solicitacao: SolicitacaoResgate;
    }> {
        return this.http.put<{
            message: string;
            solicitacao: SolicitacaoResgate;
        }>(`${this.apiUrl}/solicitacoes/${id}`, { status, observacoes });
    }

    // Cancelar solicitação
    cancelarSolicitacao(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/solicitacoes/${id}`);
    }

    // Gerar horários disponíveis baseado na configuração
    gerarHorariosDisponiveis(config: ConfiguracaoResgate, data: Date): Date[] {
        const diaSemana = data.getDay();

        // Verificar se o dia da semana está disponível
        if (!config.diasSemana.includes(diaSemana)) {
            return [];
        }

        const horarios: Date[] = [];

        config.horariosDisponiveis.forEach(periodo => {
            const [horaInicio, minutoInicio] = periodo.horaInicio.split(':').map(Number);
            const [horaFim, minutoFim] = periodo.horaFim.split(':').map(Number);

            let horaAtual = new Date(data);
            horaAtual.setHours(horaInicio, minutoInicio, 0, 0);

            const horaFinal = new Date(data);
            horaFinal.setHours(horaFim, minutoFim, 0, 0);

            while (horaAtual < horaFinal) {
                horarios.push(new Date(horaAtual));
                horaAtual = new Date(horaAtual.getTime() + config.intervaloMinutos * 60000);
            }
        });

        return horarios;
    }
}
