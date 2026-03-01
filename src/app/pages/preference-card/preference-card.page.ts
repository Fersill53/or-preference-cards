import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { DataService } from '../../../core/data.service';
import { PreferenceCard } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-preference-card-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule, MatChipsModule],
  templateUrl: './preference-card.page.html',
  styleUrl: './preference-card.page.scss',
})
export class PreferenceCardPage {
  specialtyId = '';
  surgeonId = '';
  procedureId = '';

  card?: PreferenceCard;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId') ?? '';
    this.surgeonId = this.route.snapshot.paramMap.get('surgeonId') ?? '';
    this.procedureId = this.route.snapshot.paramMap.get('procedureId') ?? '';

    this.card = this.data.getPreferenceCard(this.specialtyId, this.surgeonId, this.procedureId);
  }

  back() {
    this.router.navigate(['/specialties', this.specialtyId, 'surgeons', this.surgeonId, 'procedures']);
  }
}