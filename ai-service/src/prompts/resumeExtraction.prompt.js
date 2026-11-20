/**
 * resumeExtraction.prompt.js
 *
 * Returns a prompt that instructs Gemini to extract skills from a resume and
 * normalise them against a known catalog.  The model MUST respond with valid
 * JSON so the caller can parse it reliably.
 */
module.exports = ({ resumeText, skills }) =>
  `You are a resume parsing assistant. Extract all technical and soft skills from the resume text below and normalise them to the closest match in the provided skill catalog.

Skill catalog (use ONLY these names):
${skills.join(', ')}

Rules:
- Return ONLY a JSON array of skill name strings, e.g. ["JavaScript", "React", "Git"]
- Include only catalog skills that are clearly mentioned or strongly implied in the resume
- Do not include skills that are absent from the catalog
- Output nothing else – no explanations, no markdown, just the JSON array

Resume text:
${resumeText}`;
