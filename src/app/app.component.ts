/*
import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
*/

//// ---- Adding settings to sidenav ---- ////

import { Component, Inject, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { DataService } from '../core/data.service';

type SettingsDialogData = {
  exportJson: string;
};

@Component({
  standalone: true,
  selector: 'app-settings-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Settings</h2>

    <div mat-dialog-content class="dialog-content">
      <p class="hint">
        Export/Import your local data. This is saved in your browser for this site.
      </p>

      <mat-form-field appearance="outline" class="field">
        <mat-label>Export / Import JSON</mat-label>
        <textarea matInput rows="10" [(ngModel)]="text"></textarea>
      </mat-form-field>

      <input #fileInput type="file" accept="application/json" (change)="onFile($event)" hidden />
    </div>

    <div mat-dialog-actions align="end" class="actions">
      <button mat-stroked-button type="button" (click)="download()">
        <mat-icon>download</mat-icon> Export File
      </button>

      <button mat-stroked-button type="button" (click)="copy()">
        <mat-icon>content_copy</mat-icon> Copy
      </button>

      <button mat-stroked-button type="button" (click)="triggerFile(fileInput)">
        <mat-icon>upload</mat-icon> Import File
      </button>

      <button mat-flat-button color="primary" type="button" (click)="import()">
        Import
      </button>

      <button mat-stroked-button color="warn" type="button" (click)="reset()">
        Reset Demo Data
      </button>

      <button mat-button type="button" (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .dialog-content { padding-top: 6px; }
    .hint { margin: 0 0 10px; opacity: 0.8; }
    .field { width: 100%; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  `],
})
export class SettingsDialogComponent {
  text: string;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData
  ) {
    this.text = data.exportJson;
  }

  close() {
    this.dialogRef.close();
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.text);
      alert('Copied to clipboard.');
    } catch {
      alert('Copy failed. You can manually select and copy.');
    }
  }

  download() {
    const blob = new Blob([this.text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'or-preference-cards-backup.json';
    a.click();

    URL.revokeObjectURL(url);
  }

  triggerFile(input: HTMLInputElement) {
    input.value = '';
    input.click();
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.text = String(reader.result ?? '');
    };
    reader.readAsText(file);
  }

  import() {
    try {
      this.dataService.importDbJson(this.text);
      alert('Import successful. Refreshing is recommended.');
    } catch (e: any) {
      alert(e?.message ?? 'Import failed.');
    }
  }

  reset() {
    const ok = confirm('Reset all local data back to the demo seed? This cannot be undone.');
    if (!ok) return;

    this.dataService.resetToSeed();
    alert('Reset complete. Refreshing is recommended.');
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private dialog: MatDialog, private dataService: DataService) {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  openSettings() {
    this.dialog.open(SettingsDialogComponent, {
      width: '720px',
      data: { exportJson: this.dataService.exportDbJson(true) },
    });
  }
}