import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DataService } from '../../../core/data.service';
import { Procedure } from '../../../core/models';

type ProcedureListItem = Procedure & {
  specialtyName: string;
  surgeonName: string;
};

@Component({
  standalone: true,
  selector: 'app-procedures-page',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './procedures.page.html',
  styleUrl: './procedures.page.scss',
})
export class ProceduresPage {
  // If these are null -> we're in global mode (/procedures)
  specialtyId: string | null = null;
  surgeonId: string | null = null;

  title = 'Procedures';
  subtitle = 'Select a procedure to view the preference card.';

  procedures: ProcedureListItem[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId');
    this.surgeonId = this.route.snapshot.paramMap.get('surgeonId');

    const raw = this.specialtyId && this.surgeonId
      ? this.data.getProceduresBySpecialtyAndSurgeon(this.specialtyId, this.surgeonId)
      : this.data.getAllProcedures();

    if (this.specialtyId && this.surgeonId) {
      const surgeonName = this.data.getSurgeonName(this.surgeonId);
      const specialtyName = this.data.getSpecialtyName(this.specialtyId);
      this.title = surgeonName;
      this.subtitle = `${specialtyName} • Select a procedure.`;
    }

    this.procedures = raw.map(p => ({
      ...p,
      specialtyName: this.data.getSpecialtyName(p.specialtyId),
      surgeonName: this.data.getSurgeonName(p.surgeonId),
    }));
  }

  openProcedure(p: ProcedureListItem) {
    this.router.navigate([
      '/specialties',
      p.specialtyId,
      'surgeons',
      p.surgeonId,
      'procedures',
      p.id,
    ]);
  }

  back() {
    if (this.specialtyId && this.surgeonId) {
      this.router.navigate(['/specialties', this.specialtyId, 'surgeons']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}