/*
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
*

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
import { Procedure, Specialty, Surgeon } from '../../../core/models';

type ProcedureDialogMode = 'add' | 'edit';

type ProcedureDialogData = {
  mode: ProcedureDialogMode;
  procedure?: Procedure;

  specialties: Specialty[];
  surgeons: Surgeon[];

  lockedSpecialtyId?: string;
  lockedSurgeonId?: string;
};

@Component({
  standalone: true,
  selector: 'app-procedure-dialog',
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
      {{ data.mode === 'add' ? 'Add Procedure' : 'Edit Procedure' }}
    </h2>

    <div mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Procedure Name</mat-label>
          <input matInput formControlName="name" placeholder="Procedure name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Specialty</mat-label>
          <mat-select formControlName="specialtyId" [disabled]="!!data.lockedSpecialtyId">
            <mat-option *ngFor="let s of data.specialties" [value]="s.id">
              {{ s.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Surgeon</mat-label>
          <mat-select formControlName="surgeonId" [disabled]="!!data.lockedSurgeonId">
            <mat-option *ngFor="let s of data.surgeons" [value]="s.id">
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
export class ProcedureDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcedureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcedureDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      specialtyId: ['', Validators.required],
      surgeonId: ['', Validators.required],
    });

    if (data.mode === 'edit' && data.procedure) {
      this.form.patchValue({
        name: data.procedure.name,
        specialtyId: data.procedure.specialtyId,
        surgeonId: data.procedure.surgeonId,
      });
    } else {
      const defaultSpecialty = data.lockedSpecialtyId ?? data.specialties[0]?.id ?? '';
      const defaultSurgeon = data.lockedSurgeonId ?? data.surgeons[0]?.id ?? '';
      this.form.patchValue({
        specialtyId: defaultSpecialty,
        surgeonId: defaultSurgeon,
      });
    }

    if (data.lockedSpecialtyId) this.form.patchValue({ specialtyId: data.lockedSpecialtyId });
    if (data.lockedSurgeonId) this.form.patchValue({ surgeonId: data.lockedSurgeonId });
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
      surgeonId: value.surgeonId ?? '',
    });
  }
}

type ProcedureCardItem = Procedure & {
  surgeonName: string;
  specialtyName: string;
};

@Component({
  standalone: true,
  selector: 'app-procedures-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './procedures.page.html',
  styleUrl: './procedures.page.scss',
})
export class ProceduresPage {
  specialtyId: string | null = null;
  surgeonId: string | null = null;

  title = 'Procedures';
  subtitle = 'Select a procedure.';
  manageMode = false;

  specialties: Specialty[] = [];
  surgeons: Surgeon[] = [];

  procedures: ProcedureCardItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.specialties = this.data.getSpecialties();
    this.surgeons = this.data.getAllSurgeons();

    this.route.paramMap.subscribe(pm => {
      this.specialtyId = pm.get('specialtyId');
      this.surgeonId = pm.get('surgeonId');

      this.configureHeader();
      this.loadProcedures();
      this.manageMode = false;
    });
  }

  private configureHeader() {
    if (this.specialtyId && this.surgeonId) {
      const surgeonName = this.data.getSurgeonName(this.surgeonId);
      const specialtyName = this.data.getSpecialtyName(this.specialtyId);
      this.title = surgeonName;
      this.subtitle = `${specialtyName} • Select a procedure.`;
      return;
    }

    this.title = 'Procedures';
    this.subtitle = 'Select a procedure.';
  }

  private loadProcedures() {
    const raw = (this.specialtyId && this.surgeonId)
      ? this.data.getProceduresBySpecialtyAndSurgeon(this.specialtyId, this.surgeonId)
      : this.data.getAllProcedures();

    this.procedures = raw.map(p => ({
      ...p,
      surgeonName: this.data.getSurgeonName(p.surgeonId),
      specialtyName: this.data.getSpecialtyName(p.specialtyId),
    }));
  }

  toggleManage() {
    this.manageMode = !this.manageMode;
  }

  openProcedure(p: ProcedureCardItem) {
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

  addProcedure() {
    // In scoped mode, lock specialty & surgeon so you can't accidentally add in the wrong place
    const dialogRef = this.dialog.open(ProcedureDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        surgeons: this.surgeonId && this.specialtyId
          ? this.data.getSurgeonsBySpecialty(this.specialtyId)
          : this.surgeons,
        lockedSpecialtyId: this.specialtyId ?? undefined,
        lockedSurgeonId: this.surgeonId ?? undefined,
      } satisfies ProcedureDialogData,
      width: '460px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.addProcedure({
        name: result.name,
        specialtyId: result.specialtyId,
        surgeonId: result.surgeonId,
      });

      this.loadProcedures();
    });
  }

  editProcedure(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const dialogRef = this.dialog.open(ProcedureDialogComponent, {
      data: {
        mode: 'edit',
        procedure: p,
        specialties: this.specialties,
        surgeons: this.specialtyId
          ? this.data.getSurgeonsBySpecialty(this.specialtyId)
          : this.surgeons,
        lockedSpecialtyId: this.specialtyId ?? undefined,
        lockedSurgeonId: this.surgeonId ?? undefined,
      } satisfies ProcedureDialogData,
      width: '460px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.updateProcedure(p.id, {
        name: result.name,
        specialtyId: result.specialtyId,
        surgeonId: result.surgeonId,
      });

      this.loadProcedures();
    });
  }

  deleteProcedure(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const ok = confirm(
      `Delete procedure "${p.name}"?\n\nThis will also remove its preference card (if any).`
    );
    if (!ok) return;

    this.data.deleteProcedure(p.id);
    this.loadProcedures();
  }
}
*/

/*
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DataService } from '../../../core/data.service';
import { Procedure, Specialty, Surgeon, PreferenceCard } from '../../../core/models';

// ✅ Import the dialog component from your preference card page file
import { PreferenceCardDialogComponent } from '../preference-card/preference-card.page';

type ProcedureCardItem = Procedure & {
  surgeonName: string;
  specialtyName: string;
  hasCard: boolean;
};

@Component({
  standalone: true,
  selector: 'app-procedures-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './procedures.page.html',
  styleUrl: './procedures.page.scss',
})
export class ProceduresPage {
  specialtyId: string | null = null;
  surgeonId: string | null = null;

  title = 'Procedures';
  subtitle = 'Select a procedure.';
  manageMode = false;

  specialties: Specialty[] = [];
  surgeons: Surgeon[] = [];
  proceduresAll: Procedure[] = [];

  procedures: ProcedureCardItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.specialties = this.data.getSpecialties();
    this.surgeons = this.data.getAllSurgeons();
    this.proceduresAll = this.data.getAllProcedures();

    this.route.paramMap.subscribe(pm => {
      this.specialtyId = pm.get('specialtyId');
      this.surgeonId = pm.get('surgeonId');

      this.configureHeader();
      this.loadProcedures();
      this.manageMode = false;
    });
  }

  private configureHeader() {
    if (this.specialtyId && this.surgeonId) {
      const surgeonName = this.data.getSurgeonName(this.surgeonId);
      const specialtyName = this.data.getSpecialtyName(this.specialtyId);
      this.title = surgeonName;
      this.subtitle = `${specialtyName} • Select a procedure.`;
      return;
    }

    this.title = 'Procedures';
    this.subtitle = 'Select a procedure.';
  }

  private loadProcedures() {
    const raw =
      this.specialtyId && this.surgeonId
        ? this.data.getProceduresBySpecialtyAndSurgeon(this.specialtyId, this.surgeonId)
        : this.data.getAllProcedures();

    this.procedures = raw.map(p => {
      const hasCard = !!this.data.getPreferenceCard(p.specialtyId, p.surgeonId, p.id);

      return {
        ...p,
        hasCard,
        surgeonName: this.data.getSurgeonName(p.surgeonId),
        specialtyName: this.data.getSpecialtyName(p.specialtyId),
      };
    });
  }

  toggleManage() {
    this.manageMode = !this.manageMode;
  }

  openProcedure(p: ProcedureCardItem) {
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

  // ✅ QUICK CREATE: add preference card for a procedure that doesn't have one
  quickAddCard(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const dialogRef = this.dialog.open(PreferenceCardDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        surgeons: this.surgeons,
        procedures: this.proceduresAll,
        lockedSpecialtyId: p.specialtyId,
        lockedSurgeonId: p.surgeonId,
        lockedProcedureId: p.id,
      },
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result: PreferenceCard | null) => {
      if (!result) return;
      this.data.upsertPreferenceCard(result);
      this.loadProcedures();
    });
  }
}
*/

// Changes 4/20/26

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
import { Procedure, Specialty, Surgeon, PreferenceCard } from '../../../core/models';

// Dialog component is defined inside preference-card.page.ts
import { PreferenceCardDialogComponent } from '../preference-card/preference-card.page';

type ProcedureDialogMode = 'add' | 'edit';

type ProcedureDialogData = {
  mode: ProcedureDialogMode;
  procedure?: Procedure;

  specialties: Specialty[];
  surgeons: Surgeon[];

  lockedSpecialtyId?: string;
  lockedSurgeonId?: string;
};

@Component({
  standalone: true,
  selector: 'app-procedure-dialog',
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
      {{ data.mode === 'add' ? 'Add Procedure' : 'Edit Procedure' }}
    </h2>

    <div mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Procedure Name</mat-label>
          <input matInput formControlName="name" placeholder="Procedure name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Specialty</mat-label>
          <mat-select formControlName="specialtyId" [disabled]="!!data.lockedSpecialtyId">
            <mat-option *ngFor="let s of data.specialties" [value]="s.id">
              {{ s.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Surgeon</mat-label>
          <mat-select formControlName="surgeonId" [disabled]="!!data.lockedSurgeonId">
            <mat-option *ngFor="let s of data.surgeons" [value]="s.id">
              {{ s.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="form.invalid">
        {{ data.mode === 'add' ? 'Add' : 'Save' }}
      </button>
    </div>
  `,
  styles: [`
    .dialog-content { padding-top: 6px; }
    .form { display: grid; gap: 12px; min-width: 340px; }
  `],
})
export class ProcedureDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProcedureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcedureDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      specialtyId: ['', Validators.required],
      surgeonId: ['', Validators.required],
    });

    if (data.mode === 'edit' && data.procedure) {
      this.form.patchValue({
        name: data.procedure.name,
        specialtyId: data.procedure.specialtyId,
        surgeonId: data.procedure.surgeonId,
      });
    } else {
      const defaultSpecialty = data.lockedSpecialtyId ?? data.specialties[0]?.id ?? '';
      const defaultSurgeon = data.lockedSurgeonId ?? data.surgeons[0]?.id ?? '';
      this.form.patchValue({
        specialtyId: defaultSpecialty,
        surgeonId: defaultSurgeon,
      });
    }

    if (data.lockedSpecialtyId) this.form.patchValue({ specialtyId: data.lockedSpecialtyId });
    if (data.lockedSurgeonId) this.form.patchValue({ surgeonId: data.lockedSurgeonId });
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.dialogRef.close({
      name: (v.name ?? '').trim(),
      specialtyId: v.specialtyId ?? '',
      surgeonId: v.surgeonId ?? '',
    });
  }
}

type ProcedureCardItem = Procedure & {
  surgeonName: string;
  specialtyName: string;
  hasCard: boolean;
};

@Component({
  standalone: true,
  selector: 'app-procedures-page',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './procedures.page.html',
  styleUrl: './procedures.page.scss',
})
export class ProceduresPage {
  specialtyId: string | null = null;
  surgeonId: string | null = null;

  title = 'Procedures';
  subtitle = 'Select a procedure.';
  manageMode = false;

  specialties: Specialty[] = [];
  surgeonsAll: Surgeon[] = [];
  proceduresAll: Procedure[] = [];

  procedures: ProcedureCardItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.specialties = this.data.getSpecialties();
    this.surgeonsAll = this.data.getAllSurgeons();
    this.proceduresAll = this.data.getAllProcedures();

    this.route.paramMap.subscribe(pm => {
      this.specialtyId = pm.get('specialtyId');
      this.surgeonId = pm.get('surgeonId');

      this.configureHeader();
      this.loadProcedures();
      this.manageMode = false;
    });
  }

  private configureHeader() {
    if (this.specialtyId && this.surgeonId) {
      const surgeonName = this.data.getSurgeonName(this.surgeonId);
      const specialtyName = this.data.getSpecialtyName(this.specialtyId);
      this.title = surgeonName;
      this.subtitle = `${specialtyName} • Select a procedure.`;
      return;
    }

    this.title = 'Procedures';
    this.subtitle = 'Select a procedure.';
  }

  private loadProcedures() {
    const raw =
      this.specialtyId && this.surgeonId
        ? this.data.getProceduresBySpecialtyAndSurgeon(this.specialtyId, this.surgeonId)
        : this.data.getAllProcedures();

    this.proceduresAll = this.data.getAllProcedures(); // keep fresh for dialog
    this.surgeonsAll = this.data.getAllSurgeons();

    this.procedures = raw.map(p => ({
      ...p,
      hasCard: !!this.data.getPreferenceCard(p.specialtyId, p.surgeonId, p.id),
      surgeonName: this.data.getSurgeonName(p.surgeonId),
      specialtyName: this.data.getSpecialtyName(p.specialtyId),
    }));
  }

  toggleManage() {
    this.manageMode = !this.manageMode;
  }

  openProcedure(p: ProcedureCardItem) {
    this.router.navigate(['/specialties', p.specialtyId, 'surgeons', p.surgeonId, 'procedures', p.id]);
  }

  back() {
    if (this.specialtyId && this.surgeonId) {
      this.router.navigate(['/specialties', this.specialtyId, 'surgeons']);
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  // ✅ ADD PROCEDURE (dialog)
  addProcedure() {
    const scoped = !!(this.specialtyId && this.surgeonId);

    const surgeonsForDialog = scoped
      ? this.data.getSurgeonsBySpecialty(this.specialtyId!)
      : this.surgeonsAll;

    const dialogRef = this.dialog.open(ProcedureDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        surgeons: surgeonsForDialog,
        lockedSpecialtyId: this.specialtyId ?? undefined,
        lockedSurgeonId: this.surgeonId ?? undefined,
      } satisfies ProcedureDialogData,
      width: '460px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.addProcedure({
        name: result.name,
        specialtyId: result.specialtyId,
        surgeonId: result.surgeonId,
      });

      this.loadProcedures();
    });
  }

  // ✅ EDIT / DELETE (manage mode)
  editProcedure(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const scoped = !!(this.specialtyId && this.surgeonId);
    const surgeonsForDialog = scoped
      ? this.data.getSurgeonsBySpecialty(this.specialtyId!)
      : this.surgeonsAll;

    const dialogRef = this.dialog.open(ProcedureDialogComponent, {
      data: {
        mode: 'edit',
        procedure: p,
        specialties: this.specialties,
        surgeons: surgeonsForDialog,
        lockedSpecialtyId: this.specialtyId ?? undefined,
        lockedSurgeonId: this.surgeonId ?? undefined,
      } satisfies ProcedureDialogData,
      width: '460px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.data.updateProcedure(p.id, {
        name: result.name,
        specialtyId: result.specialtyId,
        surgeonId: result.surgeonId,
      });

      this.loadProcedures();
    });
  }

  deleteProcedure(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const ok = confirm(`Delete procedure "${p.name}"?\n\nThis will also remove its preference card (if any).`);
    if (!ok) return;

    this.data.deleteProcedure(p.id);
    this.loadProcedures();
  }

  // ✅ QUICK CREATE PREF CARD
  quickAddCard(p: ProcedureCardItem, ev: MouseEvent) {
    ev.stopPropagation();

    const dialogRef = this.dialog.open(PreferenceCardDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        surgeons: this.surgeonsAll,
        procedures: this.proceduresAll,
        lockedSpecialtyId: p.specialtyId,
        lockedSurgeonId: p.surgeonId,
        lockedProcedureId: p.id,
      },
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result: PreferenceCard | null) => {
      if (!result) return;
      this.data.upsertPreferenceCard(result);
      this.loadProcedures();
    });
  }
}