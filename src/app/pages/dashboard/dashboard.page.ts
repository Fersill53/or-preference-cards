import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DataService } from '../../../core/data.service';
import { Specialty } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  specialties: Specialty[] = [];

  constructor(private data: DataService, private router: Router) {
    this.specialties = this.data.getSpecialties();
  }

  openSpecialty(s: Specialty) {
    this.router.navigate(['/specialties', s.id, 'surgeons']);
  }
}