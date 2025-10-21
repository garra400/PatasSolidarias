import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhotoService } from '../../../service/photo.service';
import { RewardService } from '../../../service/reward.service';
import { UserPhoto } from '../../../model/photo.model';
import { UserReward } from '../../../model/reward.model';

@Component({
  selector: 'app-meus-brindes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meus-brindes.component.html',
  styleUrl: './meus-brindes.component.scss'
})
export class MeusBrindesComponent implements OnInit {
  activeTab: 'photos' | 'rewards' = 'photos';
  photos: UserPhoto[] = [];
  rewards: UserReward[] = [];
  selectedPhoto: UserPhoto | null = null;
  selectedReward: UserReward | null = null;
  isLoading = true;
  showScheduleModal = false;

  constructor(
    private photoService: PhotoService,
    private rewardService: RewardService
  ) {}

  ngOnInit(): void {
    this.loadPhotos();
    this.loadRewards();
  }

  loadPhotos(): void {
    this.photoService.getUserPhotos().subscribe({
      next: (photos) => {
        this.photos = photos.sort((a, b) => 
          new Date(b.dataRecebimento).getTime() - new Date(a.dataRecebimento).getTime()
        );
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar fotos:', error);
        this.isLoading = false;
      }
    });
  }

  loadRewards(): void {
    this.rewardService.getAvailableRewards().subscribe({
      next: (rewards) => {
        this.rewards = rewards;
      },
      error: (error: any) => {
        console.error('Erro ao carregar brindes:', error);
      }
    });
  }

  openPhotoModal(photo: UserPhoto): void {
    this.selectedPhoto = photo;
    if (!photo.visualizada) {
      this.photoService.markPhotoAsViewed(photo.photo._id!).subscribe();
    }
  }

  closePhotoModal(): void {
    this.selectedPhoto = null;
  }

  openRewardModal(reward: UserReward): void {
    this.selectedReward = reward;
    this.showScheduleModal = true;
  }

  closeRewardModal(): void {
    this.selectedReward = null;
    this.showScheduleModal = false;
  }

  scheduleRewardPickup(date: Date, time: string): void {
    if (this.selectedReward) {
      this.rewardService.scheduleRewardPickup(this.selectedReward._id!, date, time).subscribe({
        next: () => {
          alert('Horário de retirada agendado com sucesso!');
          this.closeRewardModal();
          this.loadRewards();
        },
        error: (error: any) => {
          alert('Erro ao agendar retirada: ' + error.error?.message);
        }
      });
    }
  }
}
