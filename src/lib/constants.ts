/**
 * Breathing Exercise Preset Configurations
 * Ready-to-use configurations for different breathing exercises
 */

export const BREATHING_EXERCISES = {
  BASIC: {
    name: 'Basic Breathing',
    description: 'Simple breathing exercise for beginners',
    inhaleCount: 4,
    holdCount: 0,
    exhaleCount: 4,
    cycles: 5,
  },
  BOX: {
    name: 'Box Breathing',
    description: 'Balanced breathing exercise for stress relief',
    inhaleCount: 4,
    holdCount: 4,
    exhaleCount: 4,
    cycles: 4,
  },
  DEEP: {
    name: 'Deep Breathing',
    description: 'Extended breathing for relaxation',
    inhaleCount: 5,
    holdCount: 5,
    exhaleCount: 5,
    cycles: 6,
  },
  TACTICAL: {
    name: 'Tactical Breathing',
    description: 'Military-style breathing for focus and calm',
    inhaleCount: 4,
    holdCount: 4,
    exhaleCount: 4,
    holdAfterExhale: 4,
    cycles: 4,
  },
} as const;

/**
 * Calm Color Palette
 * Exported as constants for easy usage throughout the app
 */
export const CALM_COLORS = {
  primary: '#4A90E2',
  primaryLight: '#6BA3E8',
  primaryLighter: '#8DB4EE',
  primaryDark: '#2E5FA3',
  background: '#F5F7FA',
  backgroundDark: '#E8ECEF',
  accent: '#A8E6CF',
  accentLight: '#C5F0D8',
  accentLighter: '#E0F5EA',
  accentDark: '#6DD4A8',
} as const;

/**
 * Accessibility Constants
 * ARIA labels and semantic hints for UI components
 */
export const A11Y = {
  buttons: {
    startBreathing: 'Start breathing exercise',
    stopBreathing: 'Stop breathing exercise',
    pauseBreathing: 'Pause breathing exercise',
  },
  hints: {
    breatheIn: 'Time to breathe in',
    hold: 'Hold your breath',
    breatheOut: 'Time to breathe out',
  },
} as const;

/**
 * PAP Protocol (Primeros Auxilios Psicológicos)
 * Psychological First Aid Steps: Listen, Protect, Connect
 */
export const PAP_PROTOCOL = [
  {
    id: 'listen',
    title: 'Escuchar',
    shortDescription: 'Ofrece un espacio seguro para expresar emociones',
    icon: 'Ear',
    fullDescription:
      'El primer paso es crear un ambiente de confianza donde la persona pueda expresar libremente sus sentimientos y preocupaciones. Escucha activa sin juzgar, muestra empatía genuina y valida las emociones que la otra persona está experimentando.',
    howToApply: [
      'Busca un lugar tranquilo y seguro',
      'Mantén contacto visual y postura abierta',
      'Refleja lo que escuchas: "Entiendo que te sientas..."',
      'No interrumpas ni ofrezcas soluciones inmediatas',
      'Respeta el ritmo de la conversación',
    ],
  },
  {
    id: 'protect',
    title: 'Proteger',
    shortDescription: 'Asegura la seguridad física y emocional',
    icon: 'Shield',
    fullDescription:
      'Evalúa riesgos inmediatos y toma medidas para mantener a la persona segura. Esto incluye evitar daño físico, garantizar acceso a recursos básicos y proteger la privacidad y confidencialidad.',
    howToApply: [
      'Identifica amenazas inmediatas a la seguridad',
      'Proporciona información sobre recursos de emergencia',
      'Asegura un ambiente libre de distracciones dañinas',
      'Mantén la confidencialidad y privacidad',
      'Ayuda a acceder a necesidades básicas (agua, alimento, descanso)',
    ],
  },
  {
    id: 'connect',
    title: 'Conectar',
    shortDescription: 'Facilita acceso a redes de apoyo y recursos',
    icon: 'Users',
    fullDescription:
      'Conecta a la persona con sus redes de apoyo social (familia, amigos, comunidad) y recursos profesionales disponibles. La conexión con otros reduce el aislamiento y proporciona apoyo sostenido.',
    howToApply: [
      'Identifica miembros de la familia o amigos de confianza',
      'Facilita contacto seguro con su red de apoyo',
      'Proporciona información sobre servicios profesionales',
      'Ayuda a crear un plan de seguimiento',
      'Ofrece recursos comunitarios relevantes',
    ],
  },
] as const;

/**
 * Application Metadata
 */
export const APP_META = {
  title: 'Chat Psy - Breathing Exercises',
  description:
    'Practice guided breathing exercises for stress relief and mindfulness',
  author: 'Chat Psy Team',
  keywords: ['breathing', 'meditation', 'mindfulness', 'stress relief'],
} as const;
