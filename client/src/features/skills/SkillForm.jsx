import { useState } from 'react';

/**
 * SkillForm.jsx
 *
 * Simple controlled form for adding a single skill with an optional proficiency
 * level.  Used inside skill-management UIs.
 *
 * Props:
 *  onAdd     {fn({name, level})}  Called when the form is submitted
 *  disabled  {bool}
 */
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillForm({ onAdd, disabled = false }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Intermediate');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd?.({ name: trimmed, level });
    setName('');
    setLevel('Intermediate');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <label style={{ flex: 1, margin: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#506259' }}>Skill name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Python…"
          disabled={disabled}
          style={{ marginTop: 6 }}
        />
      </label>
      <label style={{ margin: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#506259' }}>Level</span>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          disabled={disabled}
          style={{ marginTop: 6 }}
        >
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="button quiet"
        disabled={disabled || !name.trim()}
        style={{ flexShrink: 0 }}
      >
        Add skill
      </button>
    </form>
  );
}

