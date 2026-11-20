/**
 * MatchScore.jsx
 *
 * Displays a circular or bar-style match score from the AI job-matching API.
 *
 * Props:
 *  score          {number}    0-100
 *  matchingSkills {string[]}
 *  missingSkills  {string[]}
 *  suggestions    {string[]}
 *  source         {string}    'gemini' | 'fallback'
 *  loading        {bool}
 */
export default function MatchScore({
  score,
  matchingSkills = [],
  missingSkills = [],
  suggestions = [],
  source,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e9e2',
          borderRadius: 5,
          padding: 22,
          textAlign: 'center',
          color: '#809086',
          fontSize: 13,
        }}
      >
        Calculating match…
      </div>
    );
  }

  if (score == null) return null;

  const colour =
    score >= 70 ? '#23724e' : score >= 40 ? '#bd7a2b' : '#b05243';

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e9e2',
        borderRadius: 5,
        padding: 22,
      }}
    >
      {/* Score ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `conic-gradient(${colour} ${score}%, #edf0eb ${score}%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: colour,
            }}
          >
            {score}%
          </div>
        </div>
        <div>
          <p
            style={{ margin: 0, fontWeight: 700, color: colour, fontSize: 15 }}
          >
            {score >= 70
              ? 'Strong match'
              : score >= 40
              ? 'Partial match'
              : 'Skill gaps detected'}
          </p>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>
            {matchingSkills.length} of {matchingSkills.length + missingSkills.length} required skills
            {source === 'gemini' && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 10,
                  color: '#d3784d',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                ✦ AI
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Matching skills */}
      {matchingSkills.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#809086',
              fontWeight: 700,
            }}
          >
            You have
          </p>
          <div className="skill-row" style={{ margin: 0 }}>
            {matchingSkills.map((s) => (
              <span key={s} className="skill verified">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#809086',
              fontWeight: 700,
            }}
          >
            Gaps
          </p>
          <div className="skill-row" style={{ margin: 0 }}>
            {missingSkills.map((s) => (
              <span
                key={s}
                className="skill"
                style={{ background: '#fbe8e3', color: '#a94e3d' }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI suggestions */}
      {suggestions.length > 0 && (
        <div
          style={{
            borderTop: '1px solid #edf0eb',
            paddingTop: 12,
            marginTop: 4,
          }}
        >
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#809086',
              fontWeight: 700,
            }}
          >
            How to close the gap
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {suggestions.map((tip, i) => (
              <li
                key={i}
                style={{ fontSize: 12, color: '#3a4e43', marginBottom: 5, lineHeight: 1.5 }}
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

