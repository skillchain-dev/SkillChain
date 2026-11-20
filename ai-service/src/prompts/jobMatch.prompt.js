/**
 * jobMatch.prompt.js
 *
 * Returns a prompt that instructs Gemini to compare student skills against job
 * requirements and produce actionable, personalised gap-fill suggestions.
 */
module.exports = ({ studentSkills, requiredSkills }) =>
  `You are a career advisor for a student job-matching platform.

Student's current skills: ${studentSkills.join(', ') || 'none listed'}
Job's required skills: ${requiredSkills.join(', ')}

For each skill the student is missing, provide one concise, actionable suggestion (max 20 words each) explaining the best way to gain it quickly.

Respond ONLY with a JSON object in this exact shape – no markdown, no commentary:
{
  "suggestions": [
    "suggestion for skill 1",
    "suggestion for skill 2"
  ]
}`;
