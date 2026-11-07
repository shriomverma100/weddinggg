import React from 'react';
import { useInView } from '../hooks/useInView';

/** Gentle fade-up on first view. Animates only opacity/transform so it stays on the GPU compositor. */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; as?: 'section' | 'div' | 'footer' }> = ({
  children,
  className = '',
  as: Tag = 'section',
}) => {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${inView ? 'reveal-in' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
};
