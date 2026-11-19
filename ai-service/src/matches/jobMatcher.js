const { DEFAULT_SKILLS, findCatalogSkill, normalizeSkill } = require('../skills/skillCatalog');
const { getClient } = require('../geminiClient');
const jobMatchPrompt = require('../prompts/jobMatch.prompt');

function normalizeInputSkills(skills, catalog) {
  return [...new Set(
    (skills || [])
      .map((skill) => {
        const value = typeof skill === 'string' ? skill : skill.name;
        const known = findCatalogSkill(value, catalog);
        return known ? known.normalizedName : normalizeSkill(value);
      })
      .filter(Boolean)
  )];
}

async function _geminiMatch(client, student, required, score, matchingSkills, missingSkills) {
  try {
    const prompt = jobMatchPrompt({ studentSkills: student, requiredSkills: required });

    const interaction = await client.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
      store: false,
    });

    const raw = interaction.output_text || '';
    const jsonString = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      const match = jsonString.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (parsed && Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
      return {
        score,
        matchingSkills,
        missingSkills,
        suggestions: parsed.suggestions,
        source: 'gemini',
      };
    }
  } catch (err) {
    console.warn('[ai-service] Gemini job match failed, using fallback suggestions:', err.message);
  }

  return {
    score,
    matchingSkills,
    missingSkills,
    suggestions: missingSkills.map(
      (skill) => `Develop ${skill} through a project or guided course.`
    ),
    source: 'fallback',
  };
}

function matchJob(studentSkills, requiredSkills, catalog = DEFAULT_SKILLS) {
  const student = normalizeInputSkills(studentSkills, catalog);
  const required = normalizeInputSkills(requiredSkills, catalog);

  const matchingSkills = required.filter((skill) => student.includes(skill));
  const missingSkills = required.filter((skill) => !student.includes(skill));
  const score = required.length
    ? Math.round((matchingSkills.length / required.length) * 100)
    : 0;

  const client = getClient();
  if (client && missingSkills.length > 0) {
    return _geminiMatch(client, student, required, score, matchingSkills, missingSkills);
  }

  return {
    score,
    matchingSkills,
    missingSkills,
    suggestions: missingSkills.map(
      (skill) => `Develop ${skill} through a project or guided course.`
    ),
    source: 'fallback',
  };
}

module.exports = { matchJob };
