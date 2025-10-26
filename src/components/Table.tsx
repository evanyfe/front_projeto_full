import React from 'react';

type Col<T> = { key: keyof T; label: string; render?: (row: T) => React.ReactNode };

export function Table<T extends Record<string, any>>(
  { rows, cols, emptyText = 'Nada por aqui ainda.' }:
  { rows: T[]; cols: Col<T>[]; emptyText?: string }
) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map((c) => <th key={String(c.key)}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{color:'#6b7280', padding:'16px'}}>{emptyText}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={String(c.key)}>
                  {c.render ? c.render(r) : String(r[c.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}

          <tr><td colSpan={cols.length}>
            <div className="muted">Nada por aqui ainda.</div>
            </td></tr>
        </tbody>
      </table>
    </div>
  );
}
