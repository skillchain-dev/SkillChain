const DEFAULT_SKILLS = [
  { name: 'JavaScript', aliases: ['js', 'ecmascript'] },
  { name: 'TypeScript', aliases: ['ts'] },
  { name: 'React', aliases: ['react.js', 'reactjs'] },
  { name: 'Node.js', aliases: ['node', 'nodejs'] },
  { name: 'Express.js', aliases: ['express', 'expressjs'] },
  { name: 'MongoDB', aliases: ['mongo'] },
  { name: 'SQL', aliases: ['structured query language'] },
  { name: 'Python', aliases: [] },
  { name: 'Java', aliases: [] },
  { name: 'Git', aliases: ['github', 'gitlab'] },
  { name: 'Docker', aliases: [] },
  { name: 'AWS', aliases: ['amazon web services'] },
  { name: 'Machine Learning', aliases: ['ml'] },
  { name: 'Data Analysis', aliases: ['data analytics'] },
  { name: 'Communication', aliases: [] },
];

function normalizeSkill(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function buildCatalog(catalog = DEFAULT_SKILLS) {
  return catalog.map((skill) => ({
    ...skill,
    normalizedName: normalizeSkill(skill.name),
    normalizedAliases: (skill.aliases || []).map(normalizeSkill),
  }));
}

function findCatalogSkill(value, catalog = DEFAULT_SKILLS) {
  const normalized = normalizeSkill(value);
  return buildCatalog(catalog).find((skill) => skill.normalizedName === normalized || skill.normalizedAliases.includes(normalized));
}

module.exports = { DEFAULT_SKILLS, normalizeSkill, buildCatalog, findCatalogSkill };