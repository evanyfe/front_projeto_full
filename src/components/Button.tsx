import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = 'primary', className, ...rest }: Props) {
  const cls = ['btn', variant === 'secondary' ? 'secondary' : '', variant === 'ghost' ? 'ghost' : '', className || '']
    .filter(Boolean).join(' ');
  return <button {...rest} className={cls} />;
}
