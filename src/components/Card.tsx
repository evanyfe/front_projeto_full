import React from 'react';

type Props = React.PropsWithChildren<{ title: string; subtitle?: string; right?: React.ReactNode }>;

export function Card({ title, subtitle, right, children }: Props) {
  return (
    <div className="card">
      <div className="card-h">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-sub">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className="card-b">{children}</div>
    </div>
  );
}
