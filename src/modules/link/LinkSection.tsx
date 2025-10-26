import React, { useEffect, useState } from 'react';
import { apiFetch, ENDPOINTS, linkSupplierProduct, getProductsBySupplier, unlinkSupplierProduct } from '../../services/api';
import { Card } from '../../components/Card';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import { brl } from '../../utils/currency';
import type { Product, Supplier } from '../../types';

export function LinkSection() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [lead, setLead] = useState('');
  const [busy, setBusy] = useState(false);

  const [linked, setLinked] = useState<any[]>([]);
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [msg, setMsg] = useState('');

  const loadBasics = async () => {
    try { setSuppliers(await apiFetch(ENDPOINTS.suppliers)); } catch { setSuppliers([]); }
    try {
      const data = await apiFetch<Product[]>(ENDPOINTS.products);
      setProducts(Array.isArray(data) ? data.map(p => ({ ...p, price: (p as any).price?.toString?.() ?? p.price })) : []);
    } catch { setProducts([]); }
  };

  const loadLinked = async (sid: number) => {
    setLoadingLinked(true);
    try {
      const res = await getProductsBySupplier(sid);
      const rows = (res.products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        negotiatedPrice: p.negotiatedPrice?.toString?.() ?? p.negotiatedPrice,
        leadTimeDays: p.leadTimeDays,
        linkCreatedAt: p.linkCreatedAt,
      }));
      setLinked(rows);
    } catch { setLinked([]); }
    finally { setLoadingLinked(false); }
  };

  useEffect(() => { loadBasics(); }, []);
  useEffect(() => { const sid = Number(supplierId); if (sid) loadLinked(sid); else setLinked([]); }, [supplierId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    const sid = Number(supplierId); const pid = Number(productId);
    if (!sid || !pid) return alert('Escolha fornecedor e produto');
    setBusy(true);
    try {
      await linkSupplierProduct(sid, pid, { price: price.trim() || undefined, leadTimeDays: lead ? Number(lead) : undefined });
      setPrice(''); setLead('');
      await loadLinked(sid);
      setMsg('Fornecedor associado com sucesso ao produto!');
    } catch (err: any) {
      const m = (err?.message || '').includes('já está associado') ? 'Fornecedor já está associado a este produto!' : (err?.message || 'Erro ao vincular');
      setMsg(m);
    } finally { setBusy(false); }
  };

  const onUnlink = async (row: any) => {
    const sid = Number(supplierId);
    if (!sid) return;
    try {
      await unlinkSupplierProduct(sid, Number(row.id));
      await loadLinked(sid);
      setMsg('Fornecedor desassociado com sucesso!');
    } catch (err: any) {
      setMsg(err?.message || 'Erro ao desassociar');
    }
  };

  const parseNum = (s: string) => Number(String(s).replace(',', '.'));

  return (
    <Card
      title="Associação de Fornecedor a Produto"
      subtitle="Selecione fornecedor e produto, defina preço/prazo e associe"
      right={<Button variant="ghost" onClick={() => supplierId && loadLinked(Number(supplierId))}>Atualizar</Button>}
    >
      {msg && (
        <div className={msg.includes('sucesso') ? 'success' : msg.includes('já está associado') ? 'warn' : 'error'} style={{marginBottom:8}}>
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label className="label" style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 4 }}>Fornecedor *</div>
          <select className="input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
            <option value="">Selecione</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name} {s.cnpj ? `(${s.cnpj})` : ''}</option>
            ))}
          </select>
        </label>

        <label className="label" style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 4 }}>Produto *</div>
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">Selecione</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <div style={{ marginBottom: 12 }}>
          <TextInput label="Preço negociado (opcional)" value={price} onChange={setPrice} placeholder="99.90" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <TextInput label="Prazo (dias) - opcional" value={lead} onChange={setLead} placeholder="7" type="number" />
        </div>

        <div className="row" style={{ marginBottom: 12 }}>
          <Button type="submit" disabled={busy}>Associar Fornecedor</Button>
          <Button type="button" variant="secondary" onClick={() => supplierId && loadLinked(Number(supplierId))} disabled={busy || !supplierId}>Recarregar vinculados</Button>
        </div>
      </form>

      {/* Lista vinculados */}
      {!supplierId ? (
        <div className="muted">Selecione um fornecedor para ver os produtos vinculados.</div>
      ) : loadingLinked ? (
        <div className="muted">Carregando produtos vinculados...</div>
      ) : (
        <Table
          rows={linked}
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Produto' },
            {
              key: 'negotiatedPrice',
              label: 'Preço negociado',
              render: (row) => {
                const n = row.negotiatedPrice != null ? parseNum(String(row.negotiatedPrice)) : NaN;
                return row.negotiatedPrice == null ? '-' : isNaN(n) ? String(row.negotiatedPrice) : brl.format(n);
              },
            },
            { key: 'leadTimeDays', label: 'Prazo (dias)' },
            { key: 'linkCreatedAt', label: 'Vinculado em' },
            { key: 'id', label: '', render: (row) => (
              <Button type="button" variant="secondary" onClick={() => onUnlink(row)}>Desassociar</Button>
            )},
          ]}
          emptyText="Nenhum produto vinculado para este fornecedor."
        />
      )}
    </Card>
  );
}
