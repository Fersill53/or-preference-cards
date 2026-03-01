import { Routes } from '@angular/router';

import { DashboardPage } from './pages/dashboard/dashboard.page';
import { SurgeonsPage } from './pages/surgeons/surgeons.page';
import { ProceduresPage } from './pages/procedures/procedures.page';
import { PreferenceCardPage } from './pages/preference-card/preference-card.page'
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  { path: 'dashboard', component: DashboardPage },

  // Specialty -> Surgeons
  { path: 'specialties/:specialtyId/surgeons', component: SurgeonsPage },

  // Specialty + Surgeon -> Procedures
  {
    path: 'specialties/:specialtyId/surgeons/:surgeonId/procedures',
    component: ProceduresPage,
  },

  // Preference card detail
  {
    path: 'specialties/:specialtyId/surgeons/:surgeonId/procedures/:procedureId',
    component: PreferenceCardPage,
  },

  { path: '**', redirectTo: 'dashboard' },
];