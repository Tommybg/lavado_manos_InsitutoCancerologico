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
    technique: "Frote las palmas de las manos entre sí con movimientos circulares.",
    image: "paso1.png",
    duration: 10,
  },
  {
    id: 2,
    name: "Entre los dedos",
    description: "Frote las palmas de las manos entre sí, con los dedos entrelazados.",
    technique: "Entrelazar dedos y frotar palmas.",
    image: "paso2.png",
    duration: 10,
  },
  {
    id: 3,
    name: "Dorso de las Manos",
    description: "Frote la palma de la mano derecha contra el dorso de la mano izquierda entrelazando los dedos y viceversa.",
    technique: "Palma sobre dorso con dedos entrelazados.",
    image: "paso3.png",
    duration: 10,
  },
  {
    id: 4,
    name: "Base de los pulgares",
    description: "Frote con un movimiento de rotación el pulgar izquierdo atrapándolo con la palma de la mano derecha y viceversa.",
    technique: "Rotar pulgares con movimiento circular.",
    image: "paso4.png",
    duration: 10,
  },
  {
    id: 5,
    name: "Uñas y yemas",
    description: "Frote las puntas de los dedos de la mano derecha contra la palma de la mano izquierda, haciendo un movimiento de rotación y viceversa.",
    technique: "Frotar yemas y uñas contra palma con movimientos circulares.",
    image: "paso5.png",
    duration: 10,
  },
  {
    id: 6,
    name: "Uñas en palma",
    description: "Frotese la punta de los dedos de la mano derecha contra la palma de la mano izquierda, haciendo un movimiento de rotación y viceversa.",
    technique: "Frotar puntas de los dedos contra la palma con movimientos circulares.",
    image: "paso6.png",
    duration: 10,
  }
];

export const healthTips = [
  "Use jabón y agua tibia para una limpieza efectiva",
  "El lavado de manos debe durar al menos 60 segundos",
  "No olvide sus pulgares, a menudo se pasan por alto",
  "Limpie bien entre los dedos",
  "Seque las manos completamente para evitar el crecimiento bacteriano",
  "Cierre los grifos con toallas de papel para evitar la recontaminación"
];
