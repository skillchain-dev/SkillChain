import { useState } from 'react';
import SkillTag from './SkillTag.jsx';

/**
 * SkillMatrix.jsx
 *
 * Renders a student's skill list as a tag cloud.
 * Also provides a simple text-input to add new skills manually.
 *
 * Props:
 *  skills    {Array<{name, source, normalizedName}>}  Current skill list
 *  onChange  {fn(newSkills)}                          Called when list changes
 *  readOnly  {bool}                                   Hides the add input
 */
export default function SkillMatrix({ skills = [], onChange, readOnly = false }) {
  const [input, setInput] = useState('');

  function addSkill() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const alreadyExists = skills.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (!alreadyExists && onChange) {
      onChange([...skills, { name: trimmed, normalizedName: trimmed.toLowerCase(), source: 'manual' }]);
    }
    setInput('');
  }

  function removeSkill(name) {
    if (onChange) {
      onChange(skills.filter((s) => s.name !== name));
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <div>
      {/* Tag cloud */}
      <div className="skill-row" style={{ flexWrap: 'wrap', gap: 8, minHeight: 36 }}>
        {skills.length === 0 && (
          <span className="muted" style={{ fontSize: 13 }}>
            No skills added yet.
          </span>
        )}
        {skills.map((skill) => (
          <SkillTag
            key={skill.name}
            name={skill.name}
            source={skill.source}
            onRemove={readOnly ? undefined : removeSkill}
          />
        ))}
      </div>

      {/* Add skill input */}
      {!readOnly && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (press Enter or comma)"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            className="button quiet"
            onClick={addSkill}
            disabled={!input.trim()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

