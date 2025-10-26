type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export function TextInput({ label, value, onChange, placeholder, type = 'text', required }: Props) {
  return (
    <label className="label">
      <div style={{marginBottom: 4}}>{label}{required && <span style={{color:'#ef4444'}}> *</span>}</div>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </label>
  );
}
