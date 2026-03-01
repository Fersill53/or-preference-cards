import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DataService } from '../../../core/data.service';
import { Procedure } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-procedures-page',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './procedures.page.html',
  styleUrl: './procedures.page.scss',
})
export class ProceduresPage {
  specialtyId = '';
  surgeonId = '';
  specialtyName = '';
  surgeonName = '';
  procedures: Procedure[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId') ?? '';
    this.surgeonId = this.route.snapshot.paramMap.get('surgeonId') ?? '';

    this.specialtyName = this.data.getSpecialties().find(s => s.id === this.specialtyId)?.name ?? 'Specialty';
    this.surgeonName = this.data.getSurgeonsBySpecialty(this.specialtyId).find(s => s.id === this.surgeonId)?.name ?? 'Surgeon';

    this.procedures = this.data.getProceduresBySpecialtyAndSurgeon(this.specialtyId, this.surgeonId);
  }

  openProcedure(p: Procedure) {
    this.router.navigate([
      '/specialties',
      this.specialtyId,
      'surgeons',
      this.surgeonId,
      'procedures',
      p.id,
    ]);
  }

  back() {
    this.router.navigate(['/specialties', this.specialtyId, 'surgeons']);
  }
}