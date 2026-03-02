/*
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
*/

import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DataService } from '../../../core/data.service';
import { PreferenceCard, Procedure, Specialty, Surgeon } from '../../../core/models';

type PrefDialogMode = 'add' | 'edit';

type PrefDialogData = {
  mode: PrefDialogMode;
  specialties: Specialty[];
  surgeons: Surgeon[];
  procedures: Procedure[];

  // When editing an existing card
  card?: PreferenceCard;

  // Optional locks for scoped flows
  lockedSpecialtyId?: string;
  lockedSurgeonId?: string;
  lockedProcedureId?: string;
};

@Component({
  standalone: true,
  selector: 'app-preference-card-dialog',
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
      {{ data.mode === 'add' ? 'Add Preference Card' : 'Edit Preference Card' }}
    </h2>

    <div mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="form">
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
            <mat-option *ngFor="let s of filteredSurgeons" [value]="s.id">
              {{ s.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Procedure</mat-label>
          <mat-select formControlName="procedureId" [disabled]="!!data.lockedProcedureId">
            <mat-option *ngFor="let p of filteredProcedures" [value]="p.id">
              {{ p.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Positioning</mat-label>
          <input matInput formControlName="positioning" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Prep</mat-label>
          <input matInput formControlName="prep" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Antibiotics</mat-label>
          <input matInput formControlName="antibiotics" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Instruments (one per line)</mat-label>
          <textarea matInput rows="5" formControlName="instrumentsText"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes</mat-label>
          <textarea matInput rows="4" formControlName="notes"></textarea>
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
    .form { display: grid; gap: 12px; min-width: 340px; }
  `],
})
export class PreferenceCardDialogComponent {
  form!: FormGroup;

  filteredSurgeons: Surgeon[] = [];
  filteredProcedures: Procedure[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PreferenceCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrefDialogData
  ) {
    this.form = this.fb.group({
      specialtyId: ['', Validators.required],
      surgeonId: ['', Validators.required],
      procedureId: ['', Validators.required],
      positioning: [''],
      prep: [''],
      antibiotics: [''],
      instrumentsText: [''],
      notes: [''],
    });

    // Defaults
    const defaultSpecialty = data.lockedSpecialtyId ?? data.specialties[0]?.id ?? '';
    this.form.patchValue({ specialtyId: defaultSpecialty });

    // Initial filtering
    this.recomputeFilteredLists();

    // For add: pick first valid surgeon/procedure (after filtering)
    const defaultSurgeon = data.lockedSurgeonId ?? this.filteredSurgeons[0]?.id ?? '';
    this.form.patchValue({ surgeonId: defaultSurgeon });
    this.recomputeFilteredLists();

    const defaultProcedure = data.lockedProcedureId ?? this.filteredProcedures[0]?.id ?? '';
    this.form.patchValue({ procedureId: defaultProcedure });

    // If editing existing card, load values
    if (data.mode === 'edit' && data.card) {
      this.form.patchValue({
        specialtyId: data.card.specialtyId,
        surgeonId: data.card.surgeonId,
        procedureId: data.card.procedureId,
        positioning: data.card.positioning,
        prep: data.card.prep,
        antibiotics: data.card.antibiotics,
        instrumentsText: (data.card.instruments ?? []).join('\n'),
        notes: data.card.notes,
      });
    }

    // Apply locks (scoped routes)
    if (data.lockedSpecialtyId) this.form.patchValue({ specialtyId: data.lockedSpecialtyId });
    if (data.lockedSurgeonId) this.form.patchValue({ surgeonId: data.lockedSurgeonId });
    if (data.lockedProcedureId) this.form.patchValue({ procedureId: data.lockedProcedureId });

    // Update filtering when user changes specialty/surgeon
    this.form.get('specialtyId')!.valueChanges.subscribe(() => {
      this.recomputeFilteredLists();

      // If current surgeon is not valid for the new specialty, reset it
      const surgeonId = this.form.get('surgeonId')!.value;
      if (surgeonId && !this.filteredSurgeons.some(s => s.id === surgeonId)) {
        this.form.patchValue({ surgeonId: this.filteredSurgeons[0]?.id ?? '' });
      }

      this.recomputeFilteredLists();

      // If current procedure is not valid, reset it
      const procedureId = this.form.get('procedureId')!.value;
      if (procedureId && !this.filteredProcedures.some(p => p.id === procedureId)) {
        this.form.patchValue({ procedureId: this.filteredProcedures[0]?.id ?? '' });
      }
    });

    this.form.get('surgeonId')!.valueChanges.subscribe(() => {
      this.recomputeFilteredLists();

      const procedureId = this.form.get('procedureId')!.value;
      if (procedureId && !this.filteredProcedures.some(p => p.id === procedureId)) {
        this.form.patchValue({ procedureId: this.filteredProcedures[0]?.id ?? '' });
      }
    });
  }

  private recomputeFilteredLists() {
    const specialtyId = this.form.get('specialtyId')!.value as string;
    const surgeonId = this.form.get('surgeonId')!.value as string;

    this.filteredSurgeons = specialtyId
      ? this.data.surgeons.filter(s => s.specialtyId === specialtyId)
      : this.data.surgeons;

    this.filteredProcedures = specialtyId && surgeonId
      ? this.data.procedures.filter(p => p.specialtyId === specialtyId && p.surgeonId === surgeonId)
      : this.data.procedures;
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const instruments = (v.instrumentsText ?? '')
      .split('\n')
      .map((x: string) => x.trim())
      .filter((x: string) => !!x);

    // Get procedure name for display
    const proc = this.data.procedures.find(p => p.id === v.procedureId);

    this.dialogRef.close({
      specialtyId: v.specialtyId,
      surgeonId: v.surgeonId,
      procedureId: v.procedureId,
      procedureName: proc?.name ?? 'Procedure',
      positioning: v.positioning ?? '',
      prep: v.prep ?? '',
      antibiotics: v.antibiotics ?? '',
      instruments,
      notes: v.notes ?? '',
    } satisfies PreferenceCard);
  }
}

type CardListItem = PreferenceCard & {
  specialtyName: string;
  surgeonName: string;
};

@Component({
  standalone: true,
  selector: 'app-preference-card-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './preference-card.page.html',
  styleUrl: './preference-card.page.scss',
})
export class PreferenceCardPage {
  // Route params: when present -> detail mode
  specialtyId: string | null = null;
  surgeonId: string | null = null;
  procedureId: string | null = null;

  manageMode = false;

  // detail
  card?: PreferenceCard;

  // list
  cards: CardListItem[] = [];

  // for dialog pickers
  specialties: Specialty[] = [];
  surgeons: Surgeon[] = [];
  procedures: Procedure[] = [];

  get isDetailMode() {
    return !!(this.specialtyId && this.surgeonId && this.procedureId);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dialog: MatDialog
  ) {
    this.specialties = this.data.getSpecialties();
    this.surgeons = this.data.getAllSurgeons();
    this.procedures = this.data.getAllProcedures();

    this.route.paramMap.subscribe(pm => {
      this.specialtyId = pm.get('specialtyId');
      this.surgeonId = pm.get('surgeonId');
      this.procedureId = pm.get('procedureId');

      this.manageMode = false;
      this.reload();
    });
  }

  private reload() {
    if (this.isDetailMode) {
      this.card = this.data.getPreferenceCard(this.specialtyId!, this.surgeonId!, this.procedureId!);
      return;
    }

    const raw = this.data.getAllPreferenceCards();
    this.cards = raw.map(c => ({
      ...c,
      specialtyName: this.data.getSpecialtyName(c.specialtyId),
      surgeonName: this.data.getSurgeonName(c.surgeonId),
    }));
  }

  toggleManage() {
    this.manageMode = !this.manageMode;
  }

  back() {
    if (this.isDetailMode) {
      this.router.navigate(['/specialties', this.specialtyId!, 'surgeons', this.surgeonId!, 'procedures']);
      return;
    }
    this.router.navigate(['/dashboard']);
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

  addCard() {
    const dialogRef = this.dialog.open(PreferenceCardDialogComponent, {
      data: {
        mode: 'add',
        specialties: this.specialties,
        surgeons: this.surgeons,
        procedures: this.procedures,
      } satisfies PrefDialogData,
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result: PreferenceCard | null) => {
      if (!result) return;
      this.data.upsertPreferenceCard(result);
      this.reload();
    });
  }

  editCardFromList(c: CardListItem, ev: MouseEvent) {
    ev.stopPropagation();
    this.editCard(c);
  }

  editCard(c?: PreferenceCard) {
    const cardToEdit = c ?? this.card;
    if (!cardToEdit) return;

    const dialogRef = this.dialog.open(PreferenceCardDialogComponent, {
      data: {
        mode: 'edit',
        card: cardToEdit,
        specialties: this.specialties,
        surgeons: this.surgeons,
        procedures: this.procedures,
        lockedSpecialtyId: this.isDetailMode ? this.specialtyId ?? undefined : undefined,
        lockedSurgeonId: this.isDetailMode ? this.surgeonId ?? undefined : undefined,
        lockedProcedureId: this.isDetailMode ? this.procedureId ?? undefined : undefined,
      } satisfies PrefDialogData,
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((result: PreferenceCard | null) => {
      if (!result) return;
      this.data.upsertPreferenceCard(result);
      this.reload();
    });
  }

  deleteCardFromList(c: CardListItem, ev: MouseEvent) {
    ev.stopPropagation();
    this.deleteCard(c);
  }

  deleteCard(c?: PreferenceCard) {
    const cardToDelete = c ?? this.card;
    if (!cardToDelete) return;

    const ok = confirm(
      `Delete preference card for "${cardToDelete.procedureName}"?\n\nThis cannot be undone.`
    );
    if (!ok) return;

    this.data.deletePreferenceCard(cardToDelete.specialtyId, cardToDelete.surgeonId, cardToDelete.procedureId);

    if (this.isDetailMode) {
      this.router.navigate(['/specialties', cardToDelete.specialtyId, 'surgeons', cardToDelete.surgeonId, 'procedures']);
      return;
    }

    this.reload();
  }
}