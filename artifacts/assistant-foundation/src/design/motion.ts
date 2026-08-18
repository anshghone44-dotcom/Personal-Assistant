import type { Transition, Variants } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 280, damping: 28 };
export const softSpring: Transition = { type: 'spring', stiffness: 180, damping: 24 };
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
export const pageTransition: Transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] };