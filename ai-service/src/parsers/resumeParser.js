const { DEFAULT_SKILLS, findCatalogSkill, normalizeSkill } = require('../skills/skillCatalog');

function normalizeInputSkills(skills, catalog) {
  return [...new Set((skills || []).map((skill) => {
    const value = typeof skill === 'string' ? skill : skill.name;
    const known = findCatalogSkill(value, catalog);
    return known ? known.normalizedName : normalizeSkill(value);
  }).filter(Boolean))];
}

function matchJob(studentSkills, requiredSkills, catalog = DEFAULT_SKILLS) {
  const student = normalizeInputSkills(studentSkills, catalog);
  const required = normalizeInputSkills(requiredSkills, catalog);
  const matchingSkills = required.filter((skill) => student.includes(skill));
  const missingSkills = required.filter((skill) => !student.includes(skill));
  const score = required.length ? Math.round((matchingSkills.length / required.length) * 100) : 0;
  return {
    score,
    matchingSkills,
    missingSkills,
    suggestions: missingSkills.map((skill) => `Develop ${skill} through a project or guided course.`),
    source: 'fallback',
  };
}

module.exports = { matchJob };