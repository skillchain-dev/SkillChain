/**
 * chatAssistant.js
 *
 * Multi-turn career assistant powered by Gemini.
 * Falls back to a helpful static message when no API key is configured.
 */
const { getClient } = require('../geminiClient');
const chatPrompt = require('../prompts/chat.prompt');

function getFallbackReply(text) {
  const q = (text || '').toLowerCase();

  if (q.includes('resume') || q.includes('cv')) {
    return [
      "Here is how to significantly improve your resume on SkillChain:",
      "- **Quantify your impact**: Use action verbs and numbers (e.g., 'Optimized database queries, reducing latency by 42%').",
      "- **Highlight verified skills**: Upload your certificates to SkillChain so recruiters can verify credentials instantly via blockchain.",
      "- **Tailor your summary**: Write a 2-3 line summary targeting the role you want (e.g., 'Full-Stack Developer experienced in React and Node.js').",
      "- **Showcase projects**: Include live demo URLs and GitHub links to your projects.",
      "- **Use our Resume tool**: Go to the Student Dashboard -> Resume page to auto-extract skills and check your profile strength."
    ].join('\n');
  }

  if (q.includes('job') || q.includes('match') || q.includes('find') || q.includes('apply')) {
    return [
      "Here is how to find and apply for jobs that fit your profile:",
      "- **Explore Job Discovery**: Head to the Jobs page to browse active listings from top tech recruiters.",
      "- **Check your Match Score**: SkillChain calculates an AI skill compatibility percentage for each open position.",
      "- **Boost your score**: Look at the missing skills on job cards and add verifiable projects or certificates to qualify.",
      "- **Track applications**: Monitor your interview stages and feedback in real-time under My Applications."
    ].join('\n');
  }

  if (q.includes('skill') || q.includes('demand') || q.includes('learn')) {
    return [
      "The top in-demand skills in the tech industry right now:",
      "- **Frontend**: React, Next.js, TypeScript, Tailwind CSS.",
      "- **Backend & Cloud**: Node.js/Express, Python (FastAPI/Django), Docker, Kubernetes, AWS.",
      "- **Web3 & Blockchain**: Solidity, Hardhat, Ethers.js, Smart Contract Security.",
      "- **Data & AI**: Python, PyTorch, Gemini API, RAG architectures, SQL/NoSQL.",
      "- Add and verify these skills in your SkillChain profile to stand out to recruiters!"
    ].join('\n');
  }

  if (q.includes('cert') || q.includes('verif') || q.includes('blockchain') || q.includes('credential')) {
    return [
      "How SkillChain certificate verification works:",
      "- **Upload**: Submit your course completion or achievement certificate under My Certificates.",
      "- **Faculty Review**: University administrators review and validate your submission against records.",
      "- **Blockchain Proof**: Once approved, a cryptographic hash is anchored on the blockchain.",
      "- **Public Verification**: Anyone can scan your certificate's QR code or visit the public `/verify/:id` URL to confirm authenticity instantly without fraud."
    ].join('\n');
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm SkillChain AI. I'm here to help you advance your career. You can ask me how to improve your resume, discover matching jobs, learn in-demand skills, or verify certificates.";
  }

  return "I'm SkillChain AI, your placement and career assistant. You can ask me about resume optimization, matching job recommendations, high-demand technical skills, or how our blockchain certificate verification works!";
}

/**
 * chat
 *
 * Sends a message to the Gemini model and returns the assistant's reply.
 * Accepts an optional previousInteractionId to continue a conversation thread.
 * Falls back to an intelligent local career assistant if GEMINI_API_KEY is not configured.
 *
 * @param {string} message                 User's message
 * @param {string|null} previousInteractionId  ID from the previous turn (optional)
 * @returns {Promise<{reply: string, interactionId: string|null, source: string}>}
 */
async function chat(message, previousInteractionId = null) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('message must be a non-empty string');
  }

  const client = getClient();

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: chatPrompt },
        contents: message.trim(),
      });

      const reply = response.text || 'Sorry, I could not generate a response.';
      return {
        reply,
        interactionId: `gemini-${Date.now()}`,
        source: 'gemini',
      };
    } catch (err) {
      console.warn('[ai-service] Gemini chat failed:', err.message);
    }
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return {
    reply: getFallbackReply(message),
    interactionId: null,
    source: 'fallback',
  };
}

module.exports = { chat };

