import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
    styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
      min-height: 250px;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ChartComponent implements AfterViewInit {
    @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;
    @Input() type: 'bar' | 'line' | 'doughnut' = 'bar';
    @Input() data: number[] = [];
    @Input() labels: string[] = [];
    @Input() colors: string[] = ['#667eea', '#764ba2', '#48bb78', '#ed8936'];

    ngAfterViewInit(): void {
        setTimeout(() => this.drawChart(), 100);
    }

    private drawChart(): void {
        const canvas = this.canvas.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        if (this.type === 'bar') {
            this.drawBarChart(ctx, canvas.width, canvas.height);
        } else if (this.type === 'line') {
            this.drawLineChart(ctx, canvas.width, canvas.height);
        } else if (this.type === 'doughnut') {
            this.drawDoughnutChart(ctx, canvas.width, canvas.height);
        }
    }

    private drawBarChart(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / this.data.length - 10;
        const maxValue = Math.max(...this.data);

        // Draw bars
        this.data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + 10);
            const y = height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);

            // Draw label
            ctx.fillText(this.labels[index] || '', x + barWidth / 2, height - padding + 20);
        });
    }

    private drawLineChart(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = Math.max(...this.data);
        const pointSpacing = chartWidth / (this.data.length - 1);

        ctx.strokeStyle = this.colors[0];
        ctx.lineWidth = 3;
        ctx.beginPath();

        this.data.forEach((value, index) => {
            const x = padding + index * pointSpacing;
            const y = height - padding - (value / maxValue) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = this.colors[0];
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.labels[index] || '', x, height - padding + 20);
        });

        ctx.stroke();
    }

    private drawDoughnutChart(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        const total = this.data.reduce((sum, val) => sum + val, 0);
        let currentAngle = -Math.PI / 2;

        this.data.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2;

            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, radius * 0.6, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.8);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.8);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);

            currentAngle += sliceAngle;
        });

        // Draw legend
        const legendX = width - 120;
        let legendY = 20;

        this.data.forEach((value, index) => {
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fillRect(legendX, legendY, 15, 15);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${this.labels[index]}: ${value}`, legendX + 20, legendY + 12);

            legendY += 25;
        });
    }
}
