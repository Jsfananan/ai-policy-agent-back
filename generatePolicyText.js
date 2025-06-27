function generatePolicyText(answers, orgName) {
  const get = (id) => answers.find(a => a.question.toLowerCase() === id.toLowerCase())?.answer || 'Not specified';

  return `
AI Use Policy for ${orgName}
==================================================

1. Purpose  
To outline the responsible and values-aligned use of AI tools within ${orgName}.

2. Scope  
This policy applies to all staff, team members, and collaborators authorized to use AI tools in the course of work.

3. Industry Context  
As an organization in the ${get('industry')} sector, we recognize both the opportunities and risks that AI presents in our specific context.

4. AI Tools in Use  
The following AI tools are approved or in use: ${get('tools')}.

5. Tool Access Policy  
${get('tools').toLowerCase().includes('pre-approved') ? 'Only pre-approved AI tools may be used.' : 'Any AI tools may be used at the user’s discretion.'}

6. Brand Guidelines  
${get('brand').toLowerCase().startsWith('y') ? `AI-generated content must align with our brand guide: ${get('brand guide')}` : 'There is no requirement to follow brand guidelines for AI content.'}

7. Who Can Use AI  
${get('who')}. ${get('who').toLowerCase().includes('only') || get('who').toLowerCase().includes('trained') ? 'Only designated personnel may access AI tools.' : 'Anyone on the team may access AI tools.'}

8. User Agreement Requirement  
${get('who').toLowerCase().includes('yes') ? 'All users must sign this policy before using AI tools.' : 'No signature is required to use AI tools.'}

9. Human Oversight  
All AI-generated content must be reviewed by a human before being shared externally.

10. Fact and Quote Verification  
Any AI-generated statistics or quotations must be verified by a human before use.

11. Prohibited Use Areas  
${get('prohibited').toLowerCase() === 'none' ? 'No areas are currently restricted from AI use.' : 'The following uses of AI are prohibited: ' + get('prohibited')}

12. Image Disclaimers  
${get('images').toLowerCase().startsWith('y') ? 'AI-generated images must include a disclaimer or label.' : 'No disclaimer is required for AI-generated images.'}

13. Data Privacy and Prompt Design  
Users must avoid including any sensitive or personally identifiable information in AI prompts.

14. Ethical Use  
AI outputs must not be used to mislead, plagiarize, or bypass due diligence and human judgment.

==================================================

📎 Definitions

AI (Artificial Intelligence): Tools and systems that simulate human intelligence, such as ChatGPT or Claude.  

Generative AI: AI that creates new content like text, images, video, or code.  

Hallucination: When AI generates content that is factually incorrect or misleading.  

Human-in-the-loop:** A process that requires human oversight or approval before AI output is used.  

Prompt: The instructions or input given to an AI tool.

==================================================

15. User Acknowledgement & Signature

By signing below, I acknowledge that I have read, understood, and agreed to follow the AI Use Policy outlined above.

Name: ___________________________  
Title/Role: ___________________________  
Signature: ___________________________  
Date: ___________________________
  `;
}

module.exports = { generatePolicyText };
