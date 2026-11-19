const { DEFAULT_SKILLS, findCatalogSkill, normalizeSkill } = require('../skills/skillCatalog');

function extractResumeSkills(resumeText, catalog = DEFAULT_SKILLS) {
  if (typeof resumeText !== 'string') {
    throw new Error('resumeText must be a string');
  }

  const text = resumeText.toLowerCase();
  const skills = catalog
    .filter((skill) => {
      const names = [skill.name, ...(skill.aliases || [])]
        .map(normalizeSkill)
        .filter(Boolean);
      return names.some((name) => new RegExp(`(^|[^a-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(text));
    })
    .map((skill) => {
      const normalizedName = normalizeSkill(skill.name);
      return {
        name: skill.name,
        normalizedName,
        source: 'fallback',
      };
    });

  if (!skills.some((skill) => skill.normalizedName === 'javascript') &&
      /\b(?:javascript|js|ecmascript)\b|\.js\b/i.test(resumeText)) {
    skills.unshift({
      name: 'JavaScript',
      normalizedName: 'javascript',
      source: 'fallback',
    });
  }

  return { skills, source: 'fallback' };
}

module.exports = { extractResumeSkills };