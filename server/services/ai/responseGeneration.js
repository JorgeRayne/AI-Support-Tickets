import ai from "../../config/gemini.js"
import aiTicket from "./aiTicket.js";
import testServer from "../../test/testServer.js";

async function generateResponse(ticket, analizedTicket) {
    const prompt = `
        You are a professional customer support representative.

        Your task is to generate a helpful, professional, and
        empathetic response to a customer's support ticket.

        Analyze the customer's original ticket and the AI-generated
        ticket summary to understand the customer's problem.

        CUSTOMER TICKET:
        Subject: ${ticket.subject}
        Description: ${ticket.description}

        AI-GENERATED TICKET SUMMARY: ${analizedTicket.summary}

        RESPONSE GUIDELINES:
        1. Acknowledge the customer's concern or problem.
        2. Show empathy and maintain a polite, professional tone.
        3. Explain the issue in simple language that a normal person
            can easily understand.
        4. Provide relevant troubleshooting steps or guidance
            when appropriate.
        5. If the issue requires further investigation, politely
            explain that the support team will review it.
        6. Do not invent facts, policies, solutions, or promises
            that are not supported by the provided information.
        7. Do not claim that the issue has been resolved unless
            the provided information confirms it.
        8. Do not mention AI analysis or internal processing.

        IMPORTANT:
        The generated response will be reviewed and approved by
        a human support agent before it is sent to the customer.

        OUTPUT REQUIREMENTS:
        - Return only the proposed customer response.
        - Use plain text.
        - Do not include JSON, Markdown formatting, or explanations.
        - Keep the response concise, clear, and professional.
    `;

    // const prompt = `
    //     You are a professional customer support representative.

    //     Your task is to generate a helpful, professional, and
    //     empathetic response to a customer's support ticket.

    //     Analyze the customer's original ticket and the AI-generated
    //     ticket summary to understand the customer's problem.

    //     CUSTOMER TICKET:
    //     Subject: Unable to log in to my account
    //     Description: I cannot log in to my account even after resetting my password.

    //     AI-GENERATED TICKET SUMMARY:
    //     Customer is unable to log in to their account despite having reset their password.

    //     RESPONSE GUIDELINES:
    //     1. Acknowledge the customer's concern or problem.
    //     2. Show empathy and maintain a polite, professional tone.
    //     3. Explain the issue in simple language that a normal person
    //         can easily understand.
    //     4. Provide relevant troubleshooting steps or guidance
    //         when appropriate.
    //     5. If the issue requires further investigation, politely
    //         explain that the support team will review it.
    //     6. Do not invent facts, policies, solutions, or promises
    //         that are not supported by the provided information.
    //     7. Do not claim that the issue has been resolved unless
    //         the provided information confirms it.
    //     8. Do not mention AI analysis or internal processing.

    //     IMPORTANT:
    //     The generated response will be reviewed and approved by
    //     a human support agent before it is sent to the customer.

    //     OUTPUT REQUIREMENTS:
    //     - Return only the proposed customer response.
    //     - Use plain text.
    //     - Do not include JSON, Markdown formatting, or explanations.
    //     - Keep the response concise, clear, and professional.
    // `;

    const response = await ai.models.generateContent({
        model:'gemini-3.5-flash-lite',
        contents: prompt
    });

    const data = response.text

    const updateTicket = await aiTicket.updateSuggestedResponse(ticket._id, data);

    return updateTicket;
}

export default generateResponse;