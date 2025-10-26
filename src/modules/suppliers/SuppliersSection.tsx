import React, { useEffect, useState } from 'react';
import { apiFetch, ENDPOINTS } from '../../services/api';
import { Card } from '../../components/Card';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Table } from '../../components/Table';
import type { Supplier } from '../../types';
import { maskCNPJ, maskPhoneBR } from '../../utils/masks';

export function SuppliersSection() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [mainContact, setMainContact] = useState('');

  const [msg, setMsg] = useState<string>('');
  const [errors, setErrors] = useState<Record<string,string>>({});

  const load = async () => {
    setLoading(true);
    try { setRows(await apiFetch(ENDPOINTS.suppliers)); } catch { setRows([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErrors({});
    try {
      const res = await apiFetch<{ message: string }>(ENDPOINTS.suppliers, {
        method: 'POST',
        body: JSON.stringify({ name, cnpj, address, phone, email, mainContact }),
      });
      setMsg(res.message || 'Fornecedor cadastrado com sucesso!');
      setName(''); setCnpj(''); setAddress(''); setPhone(''); setEmail(''); setMainContact('');
      await load();
      window.location.reload();
    } catch (err: any) {
      setMsg(err?.message || 'Erro ao cadastrar fornecedor');
      try { const j = JSON.parse(err.message); setErrors(j.fieldErrors || {}); } catch {
        setErrors({});
      }
    }
  };

  return (
    <Card title="Cadastro de Fornecedor" subtitle="Gerencie fornecedores" right={<Button variant="ghost" onClick={load}>Atualizar</Button>}>
      {msg && <div className={msg.includes('sucesso') ? 'success' : 'error'} style={{marginBottom:8}}>{msg}</div>}

      <form onSubmit={onSubmit} style={{marginBottom: 12}}>
        <TextInput label="Nome da Empresa *" value={name} onChange={setName} placeholder="Insira o nome da empresa" />
        {errors.name && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.name}</div>}

        <TextInput label="CNPJ *" value={cnpj} onChange={(v) => setCnpj(maskCNPJ(v))} placeholder="00.000.000/0000-00" />
        {errors.cnpj && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.cnpj}</div>}

        <TextInput label="Endereço *" value={address} onChange={setAddress} placeholder="Insira o endereço completo da empresa" />
        {errors.address && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.address}</div>}

        <TextInput label="Telefone *" value={phone} onChange={(v) => setPhone(maskPhoneBR(v))} placeholder="(00) 0000-0000" />
        {errors.phone && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.phone}</div>}

        <TextInput label="E-mail *" value={email} onChange={setEmail} placeholder="exemplo@fornecedor.com" />
        {errors.email && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.email}</div>}

        <TextInput label="Contato Principal *" value={mainContact} onChange={setMainContact} placeholder="Nome do contato principal" />
        {errors.mainContact && <div className="error" style={{fontSize:12, marginTop:-6, marginBottom:8}}>{errors.mainContact}</div>}

        <div className="row">
          <Button type="submit">Cadastrar</Button>
          <Button type="button" variant="secondary" onClick={load}>Recarregar</Button>
        </div>
      </form>

      {loading ? (
        <div className="muted">Carregando fornecedores...</div>
      ) : (
        <Table
          rows={rows}
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Nome' },
            { key: 'cnpj', label: 'CNPJ' },
            { key: 'address', label: 'Endereço' },
            { key: 'phone', label: 'Telefone' },
            { key: 'email', label: 'E-mail' },
            { key: 'mainContact', label: 'Contato Principal' },
            { key: 'createdAt', label: 'Criado em' },
          ]}
          emptyText="Nenhum fornecedor cadastrado."
        />
      )}
    </Card>
  );
}