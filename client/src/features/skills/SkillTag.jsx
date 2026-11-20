/**
 * SkillTag.jsx
 *
 * A pill-shaped chip for displaying a single skill.
 *
 * Props:
 *  name     {string}  Skill name to display
 *  source   {string}  'gemini' | 'fallback' — determines the badge variant
 *  onRemove {fn}      Optional. When provided, shows an × button.
 *  verified {bool}    When true, renders a "verified" tint.
 */
export default function SkillTag({ name, source, onRemove, verified = false }) {
  const isAi = source === 'gemini';

  const baseClass = verified
    ? 'skill verified'
    : 'skill';

  return (
    <span
      className={baseClass}
      title={isAi ? 'Extracted by Gemini AI' : 'Matched by keyword'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
    >
      {name}
      {isAi && (
        <span
          style={{
            fontSize: 9,
            background: '#d3784d22',
            color: '#d3784d',
            borderRadius: 3,
            padding: '1px 4px',
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          AI
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(name)}
          aria-label={`Remove ${name}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0 2px',
            color: 'inherit',
            lineHeight: 1,
            fontSize: 13,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

