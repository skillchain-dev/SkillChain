const { DEFAULT_SKILLS, findCatalogSkill, normalizeSkill } = require('../skills/skillCatalog');
const { getClient } = require('../geminiClient');
const resumeExtractionPrompt = require('../prompts/resumeExtraction.prompt');

async function _geminiExtract(client, resumeText, catalog) {
  try {
    const skillNames = catalog.map((s) => s.name);
    const prompt = resumeExtractionPrompt({ resumeText, skills: skillNames });

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
      const match = jsonString.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    let rawSkills = [];
    if (Array.isArray(parsed)) {
      rawSkills = parsed;
    } else if (parsed && Array.isArray(parsed.skills)) {
      rawSkills = parsed.skills;
    }

    if (rawSkills.length > 0) {
      const skills = rawSkills
        .map((item) => {
          const name = typeof item === 'string' ? item : item.name || item.skill || '';
          if (!name) return null;
          const catalogMatch = findCatalogSkill(name, catalog);
          return {
            name: catalogMatch ? catalogMatch.name : name,
            normalizedName: catalogMatch
              ? normalizeSkill(catalogMatch.name)
              : normalizeSkill(name),
            source: 'gemini',
          };
        })
        .filter(Boolean);

      const seen = new Set();
      const unique = skills.filter((s) => {
        if (seen.has(s.normalizedName)) return false;
        seen.add(s.normalizedName);
        return true;
      });

      return { skills: unique, source: 'gemini' };
    }
  } catch (err) {
    console.warn('[ai-service] Gemini resume extraction failed, using fallback:', err.message);
  }

  return _fallbackExtract(resumeText, catalog);
}

function _fallbackExtract(resumeText, catalog) {
  const text = resumeText.toLowerCase();
  const skills = catalog
    .filter((skill) => {
      const names = [skill.name, ...(skill.aliases || [])]
        .map(normalizeSkill)
        .filter(Boolean);
      return names.some((name) =>
        new RegExp(
          `(^|[^a-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`,
          'i'
        ).test(text)
      );
    })
    .map((skill) => ({
      name: skill.name,
      normalizedName: normalizeSkill(skill.name),
      source: 'fallback',
    }));

  if (
    !skills.some((s) => s.normalizedName === 'javascript') &&
    /\b(?:javascript|js|ecmascript)\b|\.js\b/i.test(resumeText)
  ) {
    skills.unshift({ name: 'JavaScript', normalizedName: 'javascript', source: 'fallback' });
  }

  return { skills, source: 'fallback' };
}

function extractResumeSkills(resumeText, catalog = DEFAULT_SKILLS) {
  if (typeof resumeText !== 'string') {
    throw new Error('resumeText must be a string');
  }

  const client = getClient();
  if (client) {
    return _geminiExtract(client, resumeText, catalog);
  }

  return _fallbackExtract(resumeText, catalog);
}

module.exports = { extractResumeSkills };
