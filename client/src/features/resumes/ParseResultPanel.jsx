import SkillTag from '../skills/SkillTag.jsx';

/**
 * ParseResultPanel.jsx
 *
 * Displays the AI-parsed skills from a resume analysis response.
 *
 * Props:
 *  result   {{ skills: Array<{name,normalizedName,source}>, source: string }}
 *  onUse    {fn(skills)}  Optional. "Use these skills" action callback.
 */
export default function ParseResultPanel({ result, onUse }) {
  if (!result) return null;

  const { skills = [], source } = result;
  const isAi = source === 'gemini';

  return (
    <div className="form-card" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="eyebrow" style={{ margin: 0 }}>
          {isAi ? '✦ AI-extracted skills' : 'Keyword-matched skills'}
        </p>
        {isAi && (
          <span
            style={{
              fontSize: 11,
              color: '#d3784d',
              background: '#d3784d18',
              borderRadius: 4,
              padding: '3px 8px',
              fontWeight: 700,
            }}
          >
            Powered by Gemini
          </span>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="muted" style={{ marginTop: 14, fontSize: 13 }}>
          No recognisable skills were found. Try adding more detail to your resume text.
        </p>
      ) : (
        <>
          <div className="skill-row" style={{ marginTop: 14 }}>
            {skills.map((skill) => (
              <SkillTag key={skill.name} name={skill.name} source={skill.source} />
            ))}
          </div>
          <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
            {skills.length} skill{skills.length !== 1 ? 's' : ''} detected.
          </p>
        </>
      )}

      {onUse && skills.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="button quiet"
            onClick={() => onUse(skills)}
          >
            Use these skills →
          </button>
        </div>
      )}
    </div>
  );
}

