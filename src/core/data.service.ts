/*
import { Injectable } from '@angular/core';
import { PreferenceCard, Procedure, Specialty, Surgeon } from './models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private specialties: Specialty[] = [
    { id: 'ortho', name: 'Orthopedics', icon: 'personal_injury' },
    { id: 'neuro', name: 'Neurosurgery', icon: 'psychology' },
    { id: 'gen', name: 'General Surgery', icon: 'medical_services' },
    { id: 'ent', name: 'ENT', icon: 'hearing' },

    { id: 'obgyn', name: 'OB/Gyn', icon: 'pregnant_woman' },
    { id: 'plastics', name: 'Plastic Surgery', icon: 'auto_fix_high' },
    { id: 'cv', name: 'Cardiovascular (CV)', icon: 'favorite' },
    { id: 'trauma', name: 'Trauma', icon: 'emergency' },
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

  getAllSurgeons(): Surgeon[] {
    return this.surgeons;
  }

  getProceduresBySpecialtyAndSurgeon(specialtyId: string, surgeonId: string): Procedure[] {
    return this.procedures.filter(p => p.specialtyId === specialtyId && p.surgeonId === surgeonId);
  }

  // NEW (navbar-friendly)
  getAllProcedures(): Procedure[] {
    return this.procedures;
  }

  getPreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): PreferenceCard | undefined {
    return this.cards.find(
      c =>
        c.specialtyId === specialtyId &&
        c.surgeonId === surgeonId &&
        c.procedureId === procedureId
    );
  }

  // NEW (navbar-friendly)
  getAllPreferenceCards(): PreferenceCard[] {
    return this.cards;
  }

  // Helpful lookups for labels on the global pages
  getSpecialtyName(id: string): string {
    return this.specialties.find(s => s.id === id)?.name ?? 'Specialty';
  }

  getSurgeonName(id: string): string {
    return this.surgeons.find(s => s.id === id)?.name ?? 'Surgeon';
  }
}
*/

/*
import { Injectable } from '@angular/core';
import { PreferenceCard, Procedure, Specialty, Surgeon } from './models';

type Db = {
  specialties: Specialty[];
  surgeons: Surgeon[];
  procedures: Procedure[];
  cards: PreferenceCard[];
};

const STORAGE_KEY = 'or-guide-db-v1';

@Injectable({ providedIn: 'root' })
export class DataService {
  // ---- Fixed specialties (dashboard) ----
  private defaultSpecialties: Specialty[] = [
    { id: 'ortho', name: 'Orthopedics', icon: 'fitness_center' },
    { id: 'neuro', name: 'Neurosurgery', icon: 'psychology' },
    { id: 'gen', name: 'General Surgery', icon: 'medical_services' },
    { id: 'ent', name: 'ENT', icon: 'hearing' },

    { id: 'obgyn', name: 'OB/Gyn', icon: 'pregnant_woman' },
    { id: 'plastics', name: 'Plastic Surgery', icon: 'auto_fix_high' },
    { id: 'cv', name: 'Cardiovascular (CV)', icon: 'favorite' },
    { id: 'trauma', name: 'Trauma', icon: 'emergency' },
  ];

  // ---- Seed data (only used first time) ----
  private seedDb(): Db {
    return {
      specialties: this.defaultSpecialties,
      surgeons: [
        { id: 'smith', specialtyId: 'ortho', name: 'Dr. Smith' },
        { id: 'patel', specialtyId: 'ortho', name: 'Dr. Patel' },
        { id: 'nguyen', specialtyId: 'neuro', name: 'Dr. Nguyen' },
        { id: 'lee', specialtyId: 'gen', name: 'Dr. Lee' },
      ],
      procedures: [
        { id: 'tka', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Knee Arthroplasty' },
        { id: 'tsa', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Shoulder Arthroplasty' },
        { id: 'acl', specialtyId: 'ortho', surgeonId: 'patel', name: 'ACL Reconstruction' },
        { id: 'crani', specialtyId: 'neuro', surgeonId: 'nguyen', name: 'Craniotomy' },
        { id: 'lapapp', specialtyId: 'gen', surgeonId: 'lee', name: 'Lap Appendectomy' },
      ],
      cards: [
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
      ],
    };
  }

  constructor() {
    this.ensureDb();
  }

  // -------------------------
  // LocalStorage helpers
  // -------------------------
  private ensureDb() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
      return;
    }

    // Ensure specialties exist and stay fixed
    const parsed = this.safeParse(raw);
    if (!parsed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
      return;
    }

    // Always enforce your fixed specialties list (dashboard stability)
    parsed.specialties = this.defaultSpecialties;
    this.writeDb(parsed);
  }

  private safeParse(raw: string): Db | null {
    try {
      return JSON.parse(raw) as Db;
    } catch {
      return null;
    }
  }

  private readDb(): Db {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return this.seedDb();
    const parsed = this.safeParse(raw);
    return parsed ?? this.seedDb();
  }

  private writeDb(db: Db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  private newId(prefix: string) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // -------------------------
  // READ
  // -------------------------
  getSpecialties(): Specialty[] {
    return this.defaultSpecialties; // fixed dashboard list
  }

  getSpecialtyName(id: string): string {
    return this.defaultSpecialties.find(s => s.id === id)?.name ?? 'Specialty';
  }

  getSurgeonName(id: string): string {
    return this.readDb().surgeons.find(s => s.id === id)?.name ?? 'Surgeon';
  }

  getAllSurgeons(): Surgeon[] {
    return this.readDb().surgeons;
  }

  getSurgeonsBySpecialty(specialtyId: string): Surgeon[] {
    return this.readDb().surgeons.filter(s => s.specialtyId === specialtyId);
  }

  getAllProcedures(): Procedure[] {
    return this.readDb().procedures;
  }

  getProceduresBySpecialtyAndSurgeon(specialtyId: string, surgeonId: string): Procedure[] {
    return this.readDb().procedures.filter(p => p.specialtyId === specialtyId && p.surgeonId === surgeonId);
  }

  getAllPreferenceCards(): PreferenceCard[] {
    return this.readDb().cards;
  }

  getPreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): PreferenceCard | undefined {
    return this.readDb().cards.find(
      c => c.specialtyId === specialtyId && c.surgeonId === surgeonId && c.procedureId === procedureId
    );
  }

  // -------------------------
  // SURGEONS CRUD
  // -------------------------
  addSurgeon(input: Omit<Surgeon, 'id'>): Surgeon {
    const db = this.readDb();
    const surgeon: Surgeon = { id: this.newId('surgeon'), ...input };
    db.surgeons = [...db.surgeons, surgeon];
    this.writeDb(db);
    return surgeon;
  }

  updateSurgeon(id: string, patch: Partial<Omit<Surgeon, 'id'>>): Surgeon | undefined {
    const db = this.readDb();
    const idx = db.surgeons.findIndex(s => s.id === id);
    if (idx < 0) return undefined;

    const updated: Surgeon = { ...db.surgeons[idx], ...patch };
    db.surgeons = db.surgeons.map(s => (s.id === id ? updated : s));

    // Keep procedures/cards specialtyId in sync if surgeon specialtyId changed
    if (patch.specialtyId) {
      db.procedures = db.procedures.map(p => (p.surgeonId === id ? { ...p, specialtyId: patch.specialtyId! } : p));
      db.cards = db.cards.map(c => (c.surgeonId === id ? { ...c, specialtyId: patch.specialtyId! } : c));
    }

    this.writeDb(db);
    return updated;
  }

  deleteSurgeon(id: string): void {
    const db = this.readDb();
    db.surgeons = db.surgeons.filter(s => s.id !== id);
    db.procedures = db.procedures.filter(p => p.surgeonId !== id);
    db.cards = db.cards.filter(c => c.surgeonId !== id);
    this.writeDb(db);
  }

  // -------------------------
  // PROCEDURES CRUD
  // -------------------------
  addProcedure(input: Omit<Procedure, 'id'>): Procedure {
    const db = this.readDb();
    const procedure: Procedure = { id: this.newId('proc'), ...input };
    db.procedures = [...db.procedures, procedure];
    this.writeDb(db);
    return procedure;
  }

  updateProcedure(id: string, patch: Partial<Omit<Procedure, 'id'>>): Procedure | undefined {
    const db = this.readDb();
    const idx = db.procedures.findIndex(p => p.id === id);
    if (idx < 0) return undefined;

    const updated: Procedure = { ...db.procedures[idx], ...patch };
    db.procedures = db.procedures.map(p => (p.id === id ? updated : p));

    // If procedure name changed, update card display name too (if card exists)
    if (patch.name) {
      db.cards = db.cards.map(c => (c.procedureId === id ? { ...c, procedureName: patch.name! } : c));
    }

    // If you changed specialty/surgeon, update cards too
    if (patch.specialtyId || patch.surgeonId) {
      db.cards = db.cards.map(c => {
        if (c.procedureId !== id) return c;
        return {
          ...c,
          specialtyId: patch.specialtyId ?? c.specialtyId,
          surgeonId: patch.surgeonId ?? c.surgeonId,
        };
      });
    }

    this.writeDb(db);
    return updated;
  }

  deleteProcedure(id: string): void {
    const db = this.readDb();
    db.procedures = db.procedures.filter(p => p.id !== id);
    db.cards = db.cards.filter(c => c.procedureId !== id);
    this.writeDb(db);
  }

  // -------------------------
  // PREFERENCE CARD CRUD
  // -------------------------
  upsertPreferenceCard(card: PreferenceCard): PreferenceCard {
    const db = this.readDb();
    const exists = db.cards.some(
      c => c.specialtyId === card.specialtyId && c.surgeonId === card.surgeonId && c.procedureId === card.procedureId
    );

    db.cards = exists
      ? db.cards.map(c =>
          c.specialtyId === card.specialtyId && c.surgeonId === card.surgeonId && c.procedureId === card.procedureId
            ? card
            : c
        )
      : [...db.cards, card];

    this.writeDb(db);
    return card;
  }

  deletePreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): void {
    const db = this.readDb();
    db.cards = db.cards.filter(c => !(c.specialtyId === specialtyId && c.surgeonId === surgeonId && c.procedureId === procedureId));
    this.writeDb(db);
  }

  // Optional: easy reset during dev
  resetToSeed(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
  }
}
*/

////  ---- Adding support to export/import ----  ////

import { Injectable } from '@angular/core';
import { PreferenceCard, Procedure, Specialty, Surgeon } from './models';

type Db = {
  specialties: Specialty[];
  surgeons: Surgeon[];
  procedures: Procedure[];
  cards: PreferenceCard[];
};

const STORAGE_KEY = 'or-guide-db-v1';

@Injectable({ providedIn: 'root' })
export class DataService {
  // ---- Fixed specialties (dashboard) ----
  private defaultSpecialties: Specialty[] = [
    { id: 'ortho', name: 'Orthopedics', icon: 'fitness_center' },
    { id: 'neuro', name: 'Neurosurgery', icon: 'psychology' },
    { id: 'gen', name: 'General Surgery', icon: 'medical_services' },
    { id: 'ent', name: 'ENT', icon: 'hearing' },

    { id: 'obgyn', name: 'OB/Gyn', icon: 'pregnant_woman' },
    { id: 'plastics', name: 'Plastic Surgery', icon: 'auto_fix_high' },
    { id: 'cv', name: 'Cardiovascular (CV)', icon: 'monitor_heart' },
    { id: 'trauma', name: 'Trauma', icon: 'emergency' },
  ];

  private seedDb(): Db {
    return {
      specialties: this.defaultSpecialties,
      surgeons: [
        { id: 'smith', specialtyId: 'ortho', name: 'Dr. Smith' },
        { id: 'patel', specialtyId: 'ortho', name: 'Dr. Patel' },
        { id: 'nguyen', specialtyId: 'neuro', name: 'Dr. Nguyen' },
        { id: 'lee', specialtyId: 'gen', name: 'Dr. Lee' },
      ],
      procedures: [
        { id: 'tka', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Knee Arthroplasty' },
        { id: 'tsa', specialtyId: 'ortho', surgeonId: 'smith', name: 'Total Shoulder Arthroplasty' },
        { id: 'acl', specialtyId: 'ortho', surgeonId: 'patel', name: 'ACL Reconstruction' },
        { id: 'crani', specialtyId: 'neuro', surgeonId: 'nguyen', name: 'Craniotomy' },
        { id: 'lapapp', specialtyId: 'gen', surgeonId: 'lee', name: 'Lap Appendectomy' },
      ],
      cards: [
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
      ],
    };
  }

  constructor() {
    this.ensureDb();
  }

  // -------------------------
  // LocalStorage helpers
  // -------------------------
  private ensureDb() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
      return;
    }

    const parsed = this.safeParse(raw);
    if (!parsed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
      return;
    }

    // Always enforce your fixed specialties list (dashboard stability)
    parsed.specialties = this.defaultSpecialties;
    this.writeDb(parsed);
  }

  private safeParse(raw: string): Db | null {
    try {
      return JSON.parse(raw) as Db;
    } catch {
      return null;
    }
  }

  private readDb(): Db {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return this.seedDb();
    const parsed = this.safeParse(raw);
    return parsed ?? this.seedDb();
  }

  private writeDb(db: Db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  private newId(prefix: string) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // -------------------------
  // READ
  // -------------------------
  getSpecialties(): Specialty[] {
    return this.defaultSpecialties;
  }

  getSpecialtyName(id: string): string {
    return this.defaultSpecialties.find(s => s.id === id)?.name ?? 'Specialty';
  }

  getSurgeonName(id: string): string {
    return this.readDb().surgeons.find(s => s.id === id)?.name ?? 'Surgeon';
  }

  getAllSurgeons(): Surgeon[] {
    return this.readDb().surgeons;
  }

  getSurgeonsBySpecialty(specialtyId: string): Surgeon[] {
    return this.readDb().surgeons.filter(s => s.specialtyId === specialtyId);
  }

  getAllProcedures(): Procedure[] {
    return this.readDb().procedures;
  }

  getProceduresBySpecialtyAndSurgeon(specialtyId: string, surgeonId: string): Procedure[] {
    return this.readDb().procedures.filter(p => p.specialtyId === specialtyId && p.surgeonId === surgeonId);
  }

  getAllPreferenceCards(): PreferenceCard[] {
    return this.readDb().cards;
  }

  getPreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): PreferenceCard | undefined {
    return this.readDb().cards.find(
      c => c.specialtyId === specialtyId && c.surgeonId === surgeonId && c.procedureId === procedureId
    );
  }

  // -------------------------
  // SURGEONS CRUD
  // -------------------------
  addSurgeon(input: Omit<Surgeon, 'id'>): Surgeon {
    const db = this.readDb();
    const surgeon: Surgeon = { id: this.newId('surgeon'), ...input };
    db.surgeons = [...db.surgeons, surgeon];
    this.writeDb(db);
    return surgeon;
  }

  updateSurgeon(id: string, patch: Partial<Omit<Surgeon, 'id'>>): Surgeon | undefined {
    const db = this.readDb();
    const idx = db.surgeons.findIndex(s => s.id === id);
    if (idx < 0) return undefined;

    const updated: Surgeon = { ...db.surgeons[idx], ...patch };
    db.surgeons = db.surgeons.map(s => (s.id === id ? updated : s));

    if (patch.specialtyId) {
      db.procedures = db.procedures.map(p => (p.surgeonId === id ? { ...p, specialtyId: patch.specialtyId! } : p));
      db.cards = db.cards.map(c => (c.surgeonId === id ? { ...c, specialtyId: patch.specialtyId! } : c));
    }

    this.writeDb(db);
    return updated;
  }

  deleteSurgeon(id: string): void {
    const db = this.readDb();
    db.surgeons = db.surgeons.filter(s => s.id !== id);
    db.procedures = db.procedures.filter(p => p.surgeonId !== id);
    db.cards = db.cards.filter(c => c.surgeonId !== id);
    this.writeDb(db);
  }

  // -------------------------
  // PROCEDURES CRUD
  // -------------------------
  addProcedure(input: Omit<Procedure, 'id'>): Procedure {
    const db = this.readDb();
    const procedure: Procedure = { id: this.newId('proc'), ...input };
    db.procedures = [...db.procedures, procedure];
    this.writeDb(db);
    return procedure;
  }

  updateProcedure(id: string, patch: Partial<Omit<Procedure, 'id'>>): Procedure | undefined {
    const db = this.readDb();
    const idx = db.procedures.findIndex(p => p.id === id);
    if (idx < 0) return undefined;

    const updated: Procedure = { ...db.procedures[idx], ...patch };
    db.procedures = db.procedures.map(p => (p.id === id ? updated : p));

    if (patch.name) {
      db.cards = db.cards.map(c => (c.procedureId === id ? { ...c, procedureName: patch.name! } : c));
    }

    if (patch.specialtyId || patch.surgeonId) {
      db.cards = db.cards.map(c => {
        if (c.procedureId !== id) return c;
        return {
          ...c,
          specialtyId: patch.specialtyId ?? c.specialtyId,
          surgeonId: patch.surgeonId ?? c.surgeonId,
        };
      });
    }

    this.writeDb(db);
    return updated;
  }

  deleteProcedure(id: string): void {
    const db = this.readDb();
    db.procedures = db.procedures.filter(p => p.id !== id);
    db.cards = db.cards.filter(c => c.procedureId !== id);
    this.writeDb(db);
  }

  // -------------------------
  // PREFERENCE CARD CRUD
  // -------------------------
  upsertPreferenceCard(card: PreferenceCard): PreferenceCard {
    const db = this.readDb();
    const exists = db.cards.some(
      c => c.specialtyId === card.specialtyId && c.surgeonId === card.surgeonId && c.procedureId === card.procedureId
    );

    db.cards = exists
      ? db.cards.map(c =>
          c.specialtyId === card.specialtyId && c.surgeonId === card.surgeonId && c.procedureId === card.procedureId
            ? card
            : c
        )
      : [...db.cards, card];

    this.writeDb(db);
    return card;
  }

  deletePreferenceCard(specialtyId: string, surgeonId: string, procedureId: string): void {
    const db = this.readDb();
    db.cards = db.cards.filter(
      c => !(c.specialtyId === specialtyId && c.surgeonId === surgeonId && c.procedureId === procedureId)
    );
    this.writeDb(db);
  }

  // -------------------------
  // EXPORT / IMPORT / RESET
  // -------------------------
  exportDbJson(pretty = true): string {
    const db = this.readDb();
    // Keep specialties fixed in exports too (for consistency)
    db.specialties = this.defaultSpecialties;
    return JSON.stringify(db, null, pretty ? 2 : 0);
  }

  importDbJson(json: string): void {
    let parsed: any;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error('Invalid JSON.');
    }

    // Minimal shape validation
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid data format.');
    if (!Array.isArray(parsed.surgeons)) throw new Error('Invalid data: surgeons must be an array.');
    if (!Array.isArray(parsed.procedures)) throw new Error('Invalid data: procedures must be an array.');
    if (!Array.isArray(parsed.cards)) throw new Error('Invalid data: cards must be an array.');

    const db: Db = {
      specialties: this.defaultSpecialties, // enforce fixed specialties
      surgeons: parsed.surgeons,
      procedures: parsed.procedures,
      cards: parsed.cards,
    };

    this.writeDb(db);
    this.ensureDb(); // normalize/enforce specialties
  }

  resetToSeed(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.seedDb()));
    this.ensureDb();
  }
}