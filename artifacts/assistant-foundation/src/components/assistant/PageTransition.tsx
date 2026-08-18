import { motion, type HTMLMotionProps } from 'framer-motion';
import { pageTransition } from '@/design/motion';

export function PageTransition({ children, className = '', ...props }: HTMLMotionProps<'main'>) {
  return (
    <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={pageTransition} className={`min-w-0 ${className}`} {...props}>
      {children}
    </motion.main>
  );
}