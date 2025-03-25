
import { Clock, Check, Info, Play, ArrowDown, ArrowUp } from "lucide-react";

export interface HandwashingStep {
  id: number;
  name: string;
  description: string;
  technique: string;
  image: string;
  duration: number; // in seconds
}

// 6 steps of handwashing protocol
export const handwashingSteps: HandwashingStep[] = [
  {
    id: 1,
    name: "Palma con palma",
    description: "Comience mojándose las manos con agua; aplique suficiente jabón para cubrir todas las superficies de las manos.",
    technique: "Frote las palmas de las manos entre sí.",
    image: "paso1.png",
    duration: 10,
  },
  {
    id: 2,
    name: "Palma sobre Dorso",
    description: "Frote la palma de la mano derecha contra el dorso de la mano izquierda entrelazando los dedos y viceversa.",
    technique: "Palma sobre dorso con dedos entrelazados.",
    image: "paso2_.png",
    duration: 10,
  },
  {
    id: 3,
    name: "Entre los dedos",
    description: "Frote las palmas de las manos entre sí, con los dedos entrelazados.",
    technique: "Entrelazar dedos y frotar palmas.",
    image: "paso3_.png",
    duration: 10,
  },

  {
    id: 4,
    name: "El Candado",
    description: "Frote el dorso de los dedos de una mano con la palma de la mano opuesta, creando asi una forma de candado.",
    technique: "Frotar el dorso de los dedos de una mano con la palma de la mano opuesta.",
    image: "paso4_.png",
    duration: 10,
  },
  {
    id: 5,
    name: "Pulgares",
    description: "Frote con un movimiento de de atras hacia adeltante el pulgar izquierdo, atrapándolo con la palma de la mano derecha y viceversa.",
    technique: "Frote con un movimiento de de atras hacia adeltante el pulgar.",
    image: "paso5.png",
    duration: 10,
  },
  {
    id: 6,
    name: "Uñas y yemas",
    description: "Frote las puntas de los dedos de la mano derecha contra la palma de la mano izquierda, haciendo un movimiento de rotación y viceversa.",
    technique: "Frotar yemas y uñas contra palma con movimientos circulares.",
    image: "paso6.png",
    duration: 10,
  }
];

export const healthTips = [
  "Cierre los grifos con toallas de papel para evitar la recontaminación",
  "El lavado de manos debe durar entre 50 y 60 segundos",
  "Seque las manos completamente para evitar el crecimiento bacteriano",
];
