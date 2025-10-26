export function maskCNPJ(v: string) {
  const d = (v || '').replace(/\D/g, '').slice(0, 14);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);

  if (d.length <= 2) return p1;
  if (d.length <= 5) return `${p1}.${p2}`;
  if (d.length <= 8) return `${p1}.${p2}.${p3}`;
  if (d.length <= 12) return `${p1}.${p2}.${p3}/${p4}`;
  return `${p1}.${p2}.${p3}/${p4}-${p5}`;
}

export function maskPhoneBR(v: string) {
  const d = (v || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    // (00) 0000-0000
    return d.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a,b,c) =>
      [a && `(${a}`, a && ') ', b, b && '-', c].filter(Boolean).join('')
    );
  }
  // (00) 00000-0000
  return d.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (_, a,b,c) =>
    [a && `(${a}`, a && ') ', b, b && '-', c].filter(Boolean).join('')
  );
}
