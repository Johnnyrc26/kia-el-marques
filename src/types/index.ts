export interface TechnicalSpecs {
  engine: string;
  displacement: string;
  power: string;
  torque: string;
  transmission: string;
  traction: string;
  dimensions: string;
  trunkCapacity: string;
  fuelTank: string;
  security: string[];
  comfortAndTech: string[];
}

export interface VehicleModel {
  id: string;
  slug: string;
  name: string;
  category: string;
  badgeType: 'red' | 'blue' | 'green' | 'gray';
  tagline: string;
  description: string;
  image: string;
  specs: string[];
  ctaLabel?: string;
  technicalSpecs: TechnicalSpecs;
  commercialHighlights: string[];
  availableColors: { name: string; hex?: string }[];
  sheetPdf: string;
  sheetImage: string;
  gallery?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export interface CommitmentItem {
  number: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export interface LeadSubmission {
  id?: string;
  created_at?: string;
  full_name: string;
  phone: string;
  email?: string;
  model_interest: string;
  primary_use: string;
  buyer_type: string;
  favorite_color: string;
  financing_interest: string;
  timeline: string;
  notes?: string;
  status?: 'nuevo' | 'contactado' | 'en_seguimiento' | 'cerrado' | 'descartado';
}
