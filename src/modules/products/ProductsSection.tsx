import React, { useEffect, useMemo, useState } from 'react';
import { brl } from '../../utils/currency';
import { apiFetch, ENDPOINTS } from '../../services/api';
import { Card } from '../../components/Card';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import type { Product } from '../../types';

export function ProductsSection() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [expiry, setExpiry] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [msg, setMsg] = useState<string>('');
  const [errors, setErrors] = useState<Record<string,string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Product[]>(ENDPOINTS.products);
      setRows(Array.isArray(data) ? data.map(p => ({ ...p, price: (p as any).price?.toString?.() ?? p.price })) : []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErrors({});
    try {
      const res = await apiFetch<{ message: string }>(ENDPOINTS.products, {
        method: 'POST',
        body: JSON.stringify({ name, price, barcode, description, quantity: Number(quantity || '0'), category, expiry: expiry || undefined, imageUrl: imageUrl || undefined }),
      });
      setMsg(res.message || 'Produto cadastrado com sucesso!');
      setName(''); setPrice(''); setBarcode(''); setDescription(''); setQuantity(''); setCategory(''); setExpiry(''); setImageUrl('');
      await load();
    } catch (err: any) {
      setMsg(err?.message || 'Erro ao cadastrar produto');
      try { const j = JSON.parse(err.message); setErrors(j.fieldErrors || {}); } catch {}
    }
  };

  const parseNum = (s: string) => Number(String(s).replace(',', '.'));

  return (
    <Card title="Cadastro de Produto" subtitle="Gerencie produtos" right={<Button variant="ghost" onClick={load}>Atualizar</Button>}>
      {msg && <div className={msg.includes('sucesso') ? 'success' : 'error'} style={{marginBottom:8}}>{msg}</div>}

      <form onSubmit={onSubmit} style={{marginBottom: 12}}>
        <TextInput label="Nome do Produto *" value={name} onChange={setName} placeholder="Insira o nome do produto" />
        {errors.name && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.name}</div>}

        <TextInput label="Código de Barras *" value={barcode} onChange={setBarcode} placeholder="Insira o código de barras" />
        {errors.barcode && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.barcode}</div>}

        <TextInput label="Descrição *" value={description} onChange={setDescription} placeholder="Descreva brevemente o produto" />
        {errors.description && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.description}</div>}

        <div className="row">
          <div style={{flex:1}}>
            <TextInput label="Preço *" value={price} onChange={setPrice} placeholder="99.90" />
            {errors.price && <div className="error" style={{fontSize:12, marginTop:-6}}>{errors.price}</div>}
          </div>
          <div style={{flex:1}}>
            <TextInput label="Quantidade em Estoque *" value={quantity} onChange={setQuantity} placeholder="0" type="number" />
            {errors.quantity && <div className="error" style={{fontSize:12, marginTop:-6}}>{errors.quantity}</div>}
          </div>
          <div style={{flex:1}}>
            <label className="label">
              <div style={{marginBottom:4}}>Categoria *</div>
              <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)} required>
                <option value="">Selecione</option>
                <option>Eletrônicos</option>
                <option>Alimentos</option>
                <option>Vestuário</option>
                <option>Higiene</option>
                <option>Outro</option>
              </select>
            </label>
            {errors.category && <div className="error" style={{fontSize:12, marginTop:-6}}>{errors.category}</div>}
          </div>
        </div>

        <div className="row">
          <div style={{flex:1}}>
            <TextInput label="Data de Validade (opcional)" value={expiry} onChange={setExpiry} placeholder="" type="date" />
          </div>
          <div style={{flex:1}}>
            <TextInput label="Imagem (URL) - opcional" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
          </div>
        </div>

        <div className="row" style={{marginTop:8}}>
          <Button type="submit">Cadastrar</Button>
          <Button type="button" variant="secondary" onClick={load}>Recarregar</Button>
        </div>
      </form>

      {loading ? (
        <div className="muted">Carregando produtos...</div>
      ) : (
        <Table
          rows={rows}
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Nome' },
            { key: 'barcode', label: 'Código de Barras' },
            { key: 'category', label: 'Categoria' },
            {
              key: 'price', label: 'Preço',
              render: (p: any) => {
                const n = Number(String(p.price).replace(',', '.'));
                return isNaN(n) ? String(p.price) : brl.format(n);
              },
            },
            { key: 'quantity', label: 'Qtd' },
            { key: 'expiry', label: 'Validade' },
            { key: 'createdAt', label: 'Criado em' },
          ]}
          emptyText="Nenhum produto cadastrado."
        />
      )}
    </Card>
  );
}