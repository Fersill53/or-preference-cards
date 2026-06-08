export type Specialty = {
  id: string;
  name: string;
  icon: string; // keep icons
};

export type Surgeon = {
  id: string;
  specialtyId: string;
  name: string;
};

export type Procedure = {
  id: string;
  specialtyId: string;
  surgeonId: string;
  name: string;
};

export type SutureEntry = {
  suture: string; //e.g. "Vicryl 2-0"
  needle: string; //e.g. "CT-1"
  qty?: number; //optional
  notes?: string; //optional
}

export type PreferenceCard = {
  specialtyId: string;
  surgeonId: string;
  procedureId: string;
  procedureName: string;

  notes: string;

  instruments: string[];
  onMayo: string[];

  positioning: string;

  sutures: SutureEntry[];

  prep: string;
  antibiotics: string;
};