import { Injectable } from '@angular/core';
import { PreferenceCard, Procedure, Specialty, Surgeon } from './models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private specialties: Specialty[] = [
    { id: 'ortho', name: 'Orthopedics' },
    { id: 'neuro', name: 'Neurosurgery' },
    { id: 'gen', name: 'General Surgery' },
    { id: 'ent', name: 'ENT' },
  ];

  private surgeons: Surgeon[] = [
    { id: 'smith', specialtyId: 'ortho', name: 'Dr. Smith' },
    { id: 'patel', specialtyId: 'ortho', name: 'Dr. Patel' },
    { id: 'nguyen', specialtyId: 'neuro', name: 'Dr. Nguyen' },
    { id: 'lee', specialtyId: 'gen', name: 'Dr. Lee' },
  ];

  private procedures: Procedure[] = [
    { id: 'tka', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Knee Arthroplasty' },
    { id: 'tsa', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Shoulder Arthroplasty' },
    { id: 'acl', specialtyId: 'ortho', surgeonId: 'patel', name: 'ACL Reconstruction' },
    { id: 'crani', specialtyId: 'neuro', surgeonId: 'nguyen', name: 'Craniotomy' },
    { id: 'lapapp', specialtyId: 'gen', surgeonId: 'lee', name: 'Lap Appendectomy' },
  ];

  private cards: PreferenceCard[] = [
    {
      specialtyId: 'ortho',
      surgeonId: 'smith',
      procedureId: 'tka',
      procedureName: 'Total Knee Arthroplasty',
      notes: 'Tourniquet. Cemented. Keep extra #10 blades.',
      instruments: ['Basic Ortho', 'TKA System', 'Pulsavac', 'Cement Bowl + Gun'],
      positioning: 'Supine, bump under hip, well leg padded.',
      prep: 'Chloraprep full leg to high thigh.',
      antibiotics: 'Ancef 2g (or per allergy).',
    },
  ];

  getSpecialties(): Specialty[] {
    return this.specialties;
  }

  getSurgeonsBySpecialty(specialtyId: string): Surgeon[] {
    return this.surgeons.filter(s => s.specialtyId === specialtyId);
  }

  getProceduresBySpecialtyAndSurgeon(specialtyId: string, surgeonId: string): Procedure[] {
    return this.procedures.filter(p => p.specialtyId === specialtyId && p.surgeonId === surgeonId);
  }

  getPreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): PreferenceCard | undefined {
    return this.cards.find(
      c =>
        c.specialtyId === specialtyId &&
        c.surgeonId === surgeonId &&
        c.procedureId === procedureId
    );
  }
}