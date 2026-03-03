/*
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DataService } from '../../../core/data.service';
import { Surgeon, Specialty } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-surgeons-page',
  imports: [CommonModule, MatCardModule, MatButtonModule],
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
*/

/*
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DataService } from '../../../core/data.service';
import { Specialty, Surgeon } from '../../../core/models';

@Component({
  standalone: true,
  selector: 'app-surgeons-page',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './surgeons.page.html',
  styleUrl: './surgeons.page.scss',
})
export class SurgeonsPage {
  specialtyId: string | null = null;
  specialtyName = 'All Specialties';
  surgeons: Surgeon[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.specialtyId = this.route.snapshot.paramMap.get('specialtyId');

    if (this.specialtyId) {
      const spec = this.data.getSpecialties().find(s => s.id === this.specialtyId) as Specialty | undefined;
      this.specialtyName = spec?.name ?? 'Specialty';
      this.surgeons = this.data.getSurgeonsBySpecialty(this.specialtyId);
    } else {
      this.specialtyName = 'Surgeons';
      this.surgeons = this.data.getAllSurgeons();
    }
  }

  openSurgeon(surgeon: Surgeon) {
    // If we don’t have a specialty context, use the surgeon’s specialtyId
    const effectiveSpecialtyId = this.specialtyId ?? surgeon.specialtyId;

    this.router.navigate(['/specialties', effectiveSpecialtyId, 'surgeons', surgeon.id, 'procedures']);
  }

  back() {
    // If you came from dashboard path, go back to dashboard
    this.router.navigate(['/dashboard']);
  }
}
*/

import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DataService } from '../../../core/data.service';
import { Specialty, Surgeon } from '../../../core/models';

type SurgeonDialogMode = 'add' | 'edit';

type SurgeonDialogData = {
  mode: SurgeonDialogMode;
  surgeon?: Surgeon;
  specialties: Specialty[];
  lockedSpecialtyId?: string;
};

@Component({
  standalone: true,
  selector: 'app-surgeon-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'add' ? 'Add Surgeon' : 'Edit Surgeon' }}
    </h2>

    <div mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Surgeon Name</mat-label>
          <input matInput formControlName="name" placeholder="Dr. Lastname" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Specialty</mat-label>
          <mat-select formControlName="specialtyId" [disabled]="!!data.lockedSpecialtyId">
            <mat-option *ngFor="let s of data.specialties" [value]="s.id">
              {{ s.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">
        {{ data.mode === 'add' ? 'Add' : 'Save' }}
      </button>
    </div>
  `,
  styles: [`
    .dialog-content { padding-top: 6px; }
    .form { display: grid; gap: 12px; min-width: 320px; }
  `],
})
export class SurgeonDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SurgeonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SurgeonDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      specialtyId: ['', Validators.required],
    });

    if (data.mode === 'edit' && data.surgeon) {
      this.form.patchValue({
        name: data.surgeon.name,
        specialtyId: data.surgeon.specialtyId,
      });
    } else {
      const defaultSpecialty = data.lockedSpecialtyId ?? data.specialties[0]?.id ?? '';
      this.form.patchValue({ specialtyId: defaultSpecialty });
    }

    if (data.lockedSpecialtyId) {
      this.form.patchValue({ specialtyId: data.lockedSpecialtyId });
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.dialogRef.close({
      name: (value.name ?? '').trim(),
      specialtyId: value.specialtyId ?? '',
    });
  }
}

@Component({
  standalone: true,
  selector: 'app-surgeons-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './surgeons.page.html',
  styleUrl: './surgeons.page.scss',
})
export class SurgeonsPage {
  specialtyId: string | null = null;
  title = 'Surgeons';
  subtitle = 'Select a surgeon.';
  manageMode = false;

  specialties: Specialty[] = [];
  surgeons: Surgeon[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.specialties = this.data.getSpecialties();

    this.route.paramMap.subscribe(pm => {
      this.specialtyId = pm.get('specialtyId');
      this.configureHeader();
      this.loadSurgeons();
      this.manageMode = false;
    });
  }

  private configureHeader() {
    if (this.specialtyId) {
      this.title = this.data.getSpecialtyName(this.specialtyId);
      this.subtitle = 'Select a surgeon.';
    } else {
      this.title = 'Surgeons';
      this.subtitle = 'Select a surgeon.';
    }
  }

  private loadSurgeons() {
    this.surgeons = this.specialtyId
      ? this.data.getSurgeonsBySpecialty(this.specialtyId)
      : this.data.getAllSurgeons();
  }

  toggleManage() {
    this.manageMode = !this.manageMode;
    console.log('manageMode:', this.manageMode)
  }

  openSurgeon(surgeon: Surgeon) {
    const effectiveSpecialtyId = this.specialtyId ?? surgeon.specialtyId;
    this.router.navigate(['/specialties', effectiveSpecialtyId, 'surgeons', surgeon.id, 'procedures']);
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

  addSurgeon() {
    const dialogRef = this.dialog.open(SurgeonDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        lockedSpecialtyId: this.specialtyId ?? undefined,
      } satisfies SurgeonDialogData,
      width: '420px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.addSurgeon({
        name: result.name,
        specialtyId: result.specialtyId,
      });

      this.loadSurgeons();
    });
  }

  editSurgeon(surgeon: Surgeon, ev: MouseEvent) {
    ev.stopPropagation();

    const dialogRef = this.dialog.open(SurgeonDialogComponent, {
      data: {
        mode: 'edit',
        surgeon,
        specialties: this.specialties,
        lockedSpecialtyId: this.specialtyId ?? undefined,
      } satisfies SurgeonDialogData,
      width: '420px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.updateSurgeon(surgeon.id, {
        name: result.name,
        specialtyId: result.specialtyId,
      });

      this.loadSurgeons();
    });
  }

  deleteSurgeon(surgeon: Surgeon, ev: MouseEvent) {
    ev.stopPropagation();

    const ok = confirm(
      `Delete ${surgeon.name}?\n\nThis will also remove that surgeon's procedures and preference cards.`
    );
    if (!ok) return;

    this.data.deleteSurgeon(surgeon.id);
    this.loadSurgeons();
  }
}