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

export type PreferenceCard = {
  specialtyId: string;
  surgeonId: string;
  procedureId: string;
  procedureName: string;
  notes: string;
  instruments: string[];
  positioning: string;
  prep: string;
  antibiotics: string;
};