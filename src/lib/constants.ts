
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
  shortDescription?: string;
  technique?: string;
  icon: any;
  durationInSeconds: number;
}

export const WASHING_STEPS: WashingStep[] = [
  {
    id: 1,
    name: "Palmas",
    shortDescription: "Frotar palmas juntas",
    description: "Comience mojándose las manos con agua, aplique suficiente jabón para cubrir todas las superficies de las manos.",
    technique: "Frote las palmas de las manos entre sí con movimientos circulares.",
    icon: Hand,
    durationInSeconds: 8.75,
  },
  {
    id: 2,
    name: "Dorso",
    shortDescription: "Palma sobre dorso",
    description: "Frota el dorso de una mano contra la palma de la otra con los dedos entrelazados.",
    technique: "Asegúrese de cubrir toda la superficie del dorso de ambas manos.",
    icon: RotateCw,
    durationInSeconds: 8.75,
  },
  {
    id: 3,
    name: "Entre los Dedos",
    shortDescription: "Entrelazar dedos",
    description: "Entrelace los dedos y frote entre ellos para asegurar una limpieza profunda.",
    technique: "Mueva los dedos hacia adelante y hacia atrás mientras están entrelazados.",
    icon: Fingerprint,
    durationInSeconds: 8.75,
  },
  {
    id: 4,
    name: "Dorso de Dedos",
    shortDescription: "Dorso de dedos",
    description: "Frota el dorso de los dedos contra la palma opuesta.",
    technique: "Mantenga los dedos trabados mientras realiza este movimiento.",
    icon: ArrowUpDown,
    durationInSeconds: 8.75,
  },
  {
    id: 5,
    name: "Pulgares",
    shortDescription: "Rotar pulgares",
    description: "Frota cada pulgar con la mano opuesta en movimiento rotatorio.",
    technique: "Haga un puño alrededor del pulgar y gire para limpiar completamente.",
    icon: ArrowLeftRight,
    durationInSeconds: 8.75,
  },
  {
    id: 6,
    name: "Uñas",
    shortDescription: "Frotar yemas y uñas",
    description: "Frota las yemas de los dedos contra la palma opuesta con movimiento circular.",
    technique: "Presione las uñas contra la palma y gire para limpiar debajo de las uñas.",
    icon: Fingerprint,
    durationInSeconds: 8.75,
  },
  {
    id: 7,
    name: "Muñecas",
    shortDescription: "Frotar muñecas",
    description: "Frota las muñecas con movimientos circulares para completar el proceso.",
    technique: "Asegúrese de cubrir toda la superficie de ambas muñecas.",
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
