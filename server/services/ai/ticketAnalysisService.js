import ai from '../../config/gemini.js'

async function analyzeTicket(ticket) {
    const prompt = `
        You are an AI support ticket analysis assistant.

        Analyze the following customer support ticket.

        Subject: ${ticket.subject}

        Description: ${ticket.description}

        Return your analysis in JSON format with these fields:

        {
            "category": "account_access | billing | technical_issue | bug_report | other",
            "suggestedPriority": "low | medium | high | urgent",
            "summary": "A short summary of the customer's problem",
            "reasoning": "Explain why you selected this category and priority"
        }

        Return JSON only. Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
    });

    return response.text;
}

export default {analyzeTicket};