
import { 
  Droplets, 
  Hand, 
  RotateCw, 
  ArrowLeftRight, 
  ArrowUpDown, 
  Fingerprint, 
  CheckCheck 
} from "lucide-react";

export interface WashingStep {
  id: number;
  name: string;
  description: string;
  icon: any;
  durationInSeconds: number;
}

export const WASHING_STEPS: WashingStep[] = [
  {
    id: 1,
    name: "Palmas",
    description: "Frota las palmas de las manos entre sí.",
    icon: Hand,
    durationInSeconds: 8.75,
  },
  {
    id: 2,
    name: "Dorso",
    description: "Frota el dorso de una mano contra la palma de la otra.",
    icon: RotateCw,
    durationInSeconds: 8.75,
  },
  {
    id: 3,
    name: "Dedos",
    description: "Entrelaza los dedos y frota entre ellos.",
    icon: Fingerprint,
    durationInSeconds: 8.75,
  },
  {
    id: 4,
    name: "Nudillos",
    description: "Frota el dorso de los dedos contra la palma opuesta.",
    icon: ArrowUpDown,
    durationInSeconds: 8.75,
  },
  {
    id: 5,
    name: "Pulgares",
    description: "Frota cada pulgar con la mano opuesta.",
    icon: ArrowLeftRight,
    durationInSeconds: 8.75,
  },
  {
    id: 6,
    name: "Uñas",
    description: "Frota las uñas contra la palma opuesta.",
    icon: Fingerprint,
    durationInSeconds: 8.75,
  },
  {
    id: 7,
    name: "Muñecas",
    description: "Frota las muñecas con movimientos circulares.",
    icon: Droplets,
    durationInSeconds: 8.75,
  },
];

export const TOTAL_DURATION = WASHING_STEPS.reduce(
  (total, step) => total + step.durationInSeconds,
  0
);

export const STEP_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export type StepStatus = typeof STEP_STATUS[keyof typeof STEP_STATUS];
