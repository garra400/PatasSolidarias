import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResgateService } from '@services/resgate.service';
import { ConfiguracaoResgate } from '@models/brinde.model';

interface DiaOpcao {
    valor: number;
    nome: string;
    emoji: string;
}

interface IntervaloOpcao {
    valor: number;
    label: string;
    descricao: string;
}

@Component({
    selector: 'app-config-resgate',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './config-resgate.component.html',
    styleUrls: ['./config-resgate.component.scss']
})
export class ConfigResgateComponent implements OnInit {
    form!: FormGroup;
    carregando = true;
    salvando = false;
    erro = '';
    sucesso = '';

    diasSemana: DiaOpcao[] = [
        { valor: 0, nome: 'Domingo', emoji: '☀️' },
        { valor: 1, nome: 'Segunda', emoji: '📅' },
        { valor: 2, nome: 'Terça', emoji: '📅' },
        { valor: 3, nome: 'Quarta', emoji: '📅' },
        { valor: 4, nome: 'Quinta', emoji: '📅' },
        { valor: 5, nome: 'Sexta', emoji: '📅' },
        { valor: 6, nome: 'Sábado', emoji: '🎉' }
    ];

    opcoesIntervalo: IntervaloOpcao[] = [
        { valor: 15, label: '15 min', descricao: 'Mais flexibilidade' },
        { valor: 30, label: '30 min', descricao: 'Recomendado' },
        { valor: 60, label: '1 hora', descricao: 'Menos agendamentos' }
    ];

    private fb = inject(FormBuilder);
    private resgateService = inject(ResgateService);

    ngOnInit(): void {
        this.inicializarForm();
        this.carregarConfiguracao();
    }

    inicializarForm(): void {
        this.form = this.fb.group({
            diasSemana: [[]],
            horarios: this.fb.array([this.criarPeriodoForm()]),
            intervaloMinutos: [30, [Validators.required, Validators.min(15)]],
            ativo: [true]
        });
    }

    get horarios(): FormArray {
        return this.form.get('horarios') as FormArray;
    }

    criarPeriodoForm(): FormGroup {
        return this.fb.group({
            horaInicio: ['09:00', Validators.required],
            horaFim: ['17:00', Validators.required]
        });
    }

    getPeriodoFormGroup(index: number): FormGroup {
        return this.horarios.at(index) as FormGroup;
    }

    carregarConfiguracao(): void {
        this.carregando = true;
        this.erro = '';

        this.resgateService.buscarConfiguracao().subscribe({
            next: (config: any) => {
                if (config) {
                    this.preencherForm(config);
                }
                this.carregando = false;
            },
            error: (err) => {
                console.error('Erro ao carregar configuração:', err);
                // Se não houver configuração, usar padrões
                this.carregando = false;
            }
        });
    }

    preencherForm(config: any): void {
        // Preencher dias da semana
        this.form.patchValue({
            diasSemana: config.diasSemana || [],
            intervaloMinutos: config.intervaloMinutos || 30,
            ativo: config.ativo !== undefined ? config.ativo : true
        });

        // Preencher horários
        if (config.horariosDisponiveis && config.horariosDisponiveis.length > 0) {
            this.horarios.clear();
            config.horariosDisponiveis.forEach((horario: any) => {
                const periodoForm = this.fb.group({
                    horaInicio: [horario.horaInicio, Validators.required],
                    horaFim: [horario.horaFim, Validators.required]
                });
                this.horarios.push(periodoForm);
            });
        }
    }

    isDiaSelecionado(dia: number): boolean {
        const dias = this.form.get('diasSemana')?.value || [];
        return dias.includes(dia);
    }

    toggleDia(dia: number): void {
        const diasControl = this.form.get('diasSemana');
        const dias = diasControl?.value || [];

        const index = dias.indexOf(dia);
        if (index > -1) {
            dias.splice(index, 1);
        } else {
            dias.push(dia);
        }

        dias.sort((a: number, b: number) => a - b);
        diasControl?.setValue(dias);
    }

    adicionarPeriodo(): void {
        this.horarios.push(this.criarPeriodoForm());
    }

    removerPeriodo(index: number): void {
        if (this.horarios.length > 1) {
            this.horarios.removeAt(index);
        }
    }

    validarPeriodo(index: number): boolean {
        const periodo = this.horarios.at(index) as FormGroup;
        const inicio = periodo.get('horaInicio')?.value;
        const fim = periodo.get('horaFim')?.value;

        if (!inicio || !fim) return false;

        const [horaI, minI] = inicio.split(':').map(Number);
        const [horaF, minF] = fim.split(':').map(Number);

        const minutosInicio = horaI * 60 + minI;
        const minutosFim = horaF * 60 + minF;

        return minutosFim <= minutosInicio;
    }

    getPreviewPeriodo(): string {
        if (this.horarios.length === 0) return '--:-- até --:--';

        const periodo = this.horarios.at(0) as FormGroup;
        const inicio = periodo.get('horaInicio')?.value || '--:--';
        const fim = periodo.get('horaFim')?.value || '--:--';

        return `${inicio} até ${fim}`;
    }

    getHorariosPreview(): string[] {
        if (this.horarios.length === 0) return [];

        const periodo = this.horarios.at(0) as FormGroup;
        const inicio = periodo.get('horaInicio')?.value;
        const fim = periodo.get('horaFim')?.value;
        const intervalo = this.form.get('intervaloMinutos')?.value || 30;

        if (!inicio || !fim) return [];

        const [horaI, minI] = inicio.split(':').map(Number);
        const [horaF, minF] = fim.split(':').map(Number);

        const minutosInicio = horaI * 60 + minI;
        const minutosFim = horaF * 60 + minF;

        if (minutosFim <= minutosInicio) return [];

        const horarios: string[] = [];
        let minutosAtual = minutosInicio;

        // Limitar preview a 10 horários
        let count = 0;
        while (minutosAtual < minutosFim && count < 10) {
            const hora = Math.floor(minutosAtual / 60);
            const minuto = minutosAtual % 60;
            horarios.push(`${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`);
            minutosAtual += intervalo;
            count++;
        }

        if (minutosAtual < minutosFim) {
            horarios.push('...');
        }

        return horarios;
    }

    resetar(): void {
        if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
            this.inicializarForm();
        }
    }

    salvar(): void {
        if (this.form.invalid) {
            this.erro = 'Por favor, preencha todos os campos obrigatórios';
            this.form.markAllAsTouched();
            return;
        }

        const diasSelecionados = this.form.get('diasSemana')?.value;
        if (!diasSelecionados || diasSelecionados.length === 0) {
            this.erro = 'Selecione pelo menos um dia da semana';
            return;
        }

        // Validar todos os períodos
        for (let i = 0; i < this.horarios.length; i++) {
            if (this.validarPeriodo(i)) {
                this.erro = `Período ${i + 1}: O horário de fim deve ser posterior ao horário de início`;
                return;
            }
        }

        this.salvando = true;
        this.erro = '';
        this.sucesso = '';

        const config: Partial<ConfiguracaoResgate> = {
            diasSemana: this.form.get('diasSemana')?.value,
            horariosDisponiveis: this.horarios.value,
            intervaloMinutos: this.form.get('intervaloMinutos')?.value,
            ativo: this.form.get('ativo')?.value
        };

        this.resgateService.atualizarConfiguracao(config).subscribe({
            next: () => {
                this.sucesso = 'Configuração salva com sucesso!';
                this.salvando = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: (err) => {
                this.erro = 'Erro ao salvar configuração. Tente novamente.';
                this.salvando = false;
                console.error(err);
            }
        });
    }
}
