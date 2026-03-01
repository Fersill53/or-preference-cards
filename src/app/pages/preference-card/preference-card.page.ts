import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { DataService } from '../../../core/data.service';
import { PreferenceCard } from '../../../core/models';

type CardListItem = PreferenceCard & {
  specialtyName: string;
  surgeonName: string;
};

@Component({
  standalone: true,
  selector: 'app-preference-card-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDividerModule, MatChipsModule],
  templateUrl: './preference-card.page.html',
  styleUrl: './preference-card.page.scss',
})
export class PreferenceCardPage {
  // When these are present -> detail mode
  specialtyId: string | null = null;
  surgeonId: string | null = null;
  procedureId: string | null = null;

  // detail
  card?: PreferenceCard;

  // list
  cards: CardListItem[] = [];

  get isDetailMode() {
    return !!(this.specialtyId && this.surgeonId && this.procedureId);
  }

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId');
    this.surgeonId = this.route.snapshot.paramMap.get('surgeonId');
    this.procedureId = this.route.snapshot.paramMap.get('procedureId');

    if (this.isDetailMode) {
      this.card = this.data.getPreferenceCard(this.specialtyId!, this.surgeonId!, this.procedureId!);
    } else {
      const raw = this.data.getAllPreferenceCards();
      this.cards = raw.map(c => ({
        ...c,
        specialtyName: this.data.getSpecialtyName(c.specialtyId),
        surgeonName: this.data.getSurgeonName(c.surgeonId),
      }));
    }
  }

  openCard(c: CardListItem) {
    this.router.navigate([
      '/specialties',
      c.specialtyId,
      'surgeons',
      c.surgeonId,
      'procedures',
      c.procedureId,
    ]);
  }

  back() {
    if (this.isDetailMode) {
      this.router.navigate(['/specialties', this.specialtyId!, 'surgeons', this.surgeonId!, 'procedures']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}