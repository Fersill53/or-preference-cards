import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DataService } from '../../../core/data.service';
import { Surgeon, Specialty } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-surgeons-page',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './surgeons.page.html',
  styleUrl: './surgeons.page.scss',
})
export class SurgeonsPage {
  specialtyId = '';
  specialtyName = '';
  surgeons: Surgeon[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId') ?? '';
    const specialty = this.data.getSpecialties().find(s => s.id === this.specialtyId) as Specialty | undefined;
    this.specialtyName = specialty?.name ?? 'Specialty';

    this.surgeons = this.data.getSurgeonsBySpecialty(this.specialtyId);
  }

  openSurgeon(surgeon: Surgeon) {
    this.router.navigate(['/specialties', this.specialtyId, 'surgeons', surgeon.id, 'procedures']);
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}