/**
 * ResumePreview.jsx
 *
 * Shows the raw resume text the user submitted in a readable, scrollable block.
 *
 * Props:
 *  text {string}  Raw resume text
 */
export default function ResumePreview({ text }) {
  if (!text || !text.trim()) return null;

  return (
    <div
      className="form-card"
      style={{ marginTop: 20, maxHeight: 320, overflowY: 'auto' }}
    >
      <p className="eyebrow" style={{ margin: '0 0 10px' }}>Resume preview</p>
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: 12,
          lineHeight: 1.7,
          color: '#3a4e43',
          margin: 0,
          fontFamily: 'inherit',
        }}
      >
        {text}
      </pre>
    </div>
  );
}

