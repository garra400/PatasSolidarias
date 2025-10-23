import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RewardService } from '@services/reward.service';
import { Reward, RewardSchedule } from '../../../model/reward.model';

@Component({
  selector: 'app-gerenciar-brindes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gerenciar-brindes.component.html',
  styleUrl: './gerenciar-brindes.component.scss'
})
export class GerenciarBrindesComponent implements OnInit {
  rewards: Reward[] = [];
  rewardForm: FormGroup;
  scheduleForm: FormGroup;
  isEditing = false;
  editingId: string | null = null;
  showModal = false;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private rewardService: RewardService
  ) {
    this.rewardForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      mes: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
      ano: ['', [Validators.required, Validators.min(2024)]],
      quantidadeDisponivel: ['', [Validators.required, Validators.min(1)]],
      ativo: [true]
    });

    this.scheduleForm = this.fb.group({
      data: ['', Validators.required],
      horarioInicio: ['', Validators.required],
      horarioFim: ['', Validators.required],
      vagasDisponiveis: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.isLoading = true;
    this.rewardService.getAllRewards().subscribe({
      next: (rewards) => {
        this.rewards = rewards;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar brindes:', error);
        this.isLoading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  openModal(reward?: Reward): void {
    this.showModal = true;
    if (reward) {
      this.isEditing = true;
      this.editingId = reward._id || null;
      this.rewardForm.patchValue(reward);
    } else {
      this.isEditing = false;
      this.editingId = null;
      this.rewardForm.reset({ ativo: true });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.rewardForm.reset();
    this.selectedFile = null;
  }

  saveReward(): void {
    if (this.rewardForm.valid) {
      const formData = new FormData();
      Object.keys(this.rewardForm.value).forEach(key => {
        formData.append(key, this.rewardForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.isEditing && this.editingId) {
        this.rewardService.updateReward(this.editingId, formData).subscribe({
          next: () => {
            this.loadRewards();
            this.closeModal();
            alert('Brinde atualizado com sucesso!');
          },
          error: (error: any) => {
            alert('Erro ao atualizar brinde: ' + error.error?.message);
          }
        });
      } else {
        this.rewardService.createReward(formData).subscribe({
          next: () => {
            this.loadRewards();
            this.closeModal();
            alert('Brinde criado com sucesso!');
          },
          error: (error: any) => {
            alert('Erro ao criar brinde: ' + error.error?.message);
          }
        });
      }
    }
  }

  deleteReward(id: string): void {
    if (confirm('Tem certeza que deseja excluir este brinde?')) {
      this.rewardService.deleteReward(id).subscribe({
        next: () => {
          this.loadRewards();
          alert('Brinde excluído com sucesso!');
        },
        error: (error: any) => {
          alert('Erro ao excluir brinde: ' + error.error?.message);
        }
      });
    }
  }
}
