import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * `accent` is the new one: the page's primary call to action. A blue button on
 * a blue-tinted page has nothing to push against, which is why the old hero's
 * two CTAs read as equal weight and neither led. Amber carries the eye.
 */
type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md dark:bg-brand-500 dark:hover:bg-brand-400',
  accent:
    'bg-accent-500 text-brand-950 shadow-sm hover:bg-accent-400 hover:shadow-md',
  secondary:
    'bg-surface text-ink border border-line-strong hover:border-brand-400 hover:bg-surface-muted',
  ghost: 'bg-transparent text-ink hover:bg-surface-muted',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base font-semibold',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-[background-color,border-color,box-shadow] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50';

// The lift belongs on transform only — animating shadow per frame is what made
// the old buttons feel sluggish on low-end phones.
const hover = { y: -2 };
const tap = { scale: 0.985 };
const spring = { type: 'spring' as const, stiffness: 400, damping: 28 };

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={hover}
      whileTap={tap}
      transition={spring}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps extends Omit<HTMLMotionProps<'a'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonLinkProps) {
  return (
    <motion.a
      whileHover={hover}
      whileTap={tap}
      transition={spring}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.a>
  );
}
