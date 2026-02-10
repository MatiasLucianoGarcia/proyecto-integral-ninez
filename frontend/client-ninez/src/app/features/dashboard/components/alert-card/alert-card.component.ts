import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-alert-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    template: `
    <mat-card class="alert-card" [class.hoverable]="clickable" (click)="onClick()">
        <div class="card-background"></div>
        <div class="card-content-wrapper">
            <div class="header">
                <div class="icon-badge">
                    <mat-icon>{{ icon }}</mat-icon>
                </div>
                <div class="title-section">
                    <span class="title">{{ title }}</span>
                    <span class="subtitle" *ngIf="subtitle">{{ subtitle }}</span>
                </div>
            </div>
            
            <div class="metric-section">
                <div *ngIf="loading" class="spinner-container">
                    <mat-spinner diameter="30"></mat-spinner>
                </div>
                <div *ngIf="!loading" class="count-wrapper">
                    <span class="count">{{ count }}</span>
                    <span class="label">casos detectados</span>
                </div>
            </div>
            
            <div class="action-footer" *ngIf="clickable">
                 <span class="action-text">Ver listado detallado</span>
                 <mat-icon class="action-icon">arrow_forward</mat-icon>
            </div>
        </div>
    </mat-card>
  `,
    styles: [`
    .alert-card {
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        border: 2px solid #e0f2fe; /* Light Blue Border */
        background: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
    }

    /* Blue Theme Background Gradient - Stronger */
    .card-background {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(145deg, #ffffff 40%, #eff6ff 100%);
        z-index: 0;
    }
    
    .card-content-wrapper {
        position: relative;
        z-index: 1;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
    }

    .alert-card.hoverable {
        cursor: pointer;
    }

    .alert-card.hoverable:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(37, 99, 235, 0.2); /* Stronger Blue shadow */
        border-color: #60a5fa; /* Blue 400 */
    }

    .alert-card.hoverable:active {
        transform: translateY(-2px);
    }

    /* Header */
    .header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .icon-badge {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        padding: 10px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
    }

    .title-section {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-weight: 700;
        font-size: 1.05rem;
        color: #1e3a8a; /* Dark Blue */
        line-height: 1.3;
    }

    .subtitle {
        font-size: 0.8rem;
        color: #64748b;
        margin-top: 2px;
        font-weight: 500;
    }

    /* Metric */
    .metric-section {
        flex-grow: 1;
        display: flex;
        align-items: center;
        margin: 0.5rem 0;
        padding: 0.5rem 0;
    }

    .count-wrapper {
        display: flex;
        flex-direction: column;
    }

    .count {
        font-size: 2.75rem;
        font-weight: 800;
        color: #2563eb; /* Blue 600 */
        line-height: 1;
        letter-spacing: -1.5px;
        text-shadow: 0 2px 10px rgba(37, 99, 235, 0.15);
    }

    .label {
        font-size: 0.85rem;
        color: #475569;
        margin-top: 0.25rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.7rem;
    }

    /* Footer */
    .action-footer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
        color: #2563eb;
        font-size: 0.85rem;
        font-weight: 600;
        opacity: 0.9;
        transition: opacity 0.2s;
    }

    .alert-card:hover .action-footer {
        opacity: 1;
        color: #1d4ed8;
    }

    .action-icon {
        font-size: 18px;
        height: 18px;
        width: 18px;
        transition: transform 0.2s;
    }

    .alert-card:hover .action-icon {
        transform: translateX(4px);
    }

    .spinner-container {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 1rem 0;
    }
  `]
})
export class AlertCardComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() count: number = 0;
    @Input() loading: boolean = false;
    @Input() clickable: boolean = true;
    @Input() icon: string = 'notifications'; // Default icon
    @Output() cardClick = new EventEmitter<void>();

    onClick() {
        if (this.clickable) this.cardClick.emit();
    }
}
