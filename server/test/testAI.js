import ticketAnalysis from "../services/ai/ticketAnalysisService.js";

const dummyTicket = {
    subject: "Payment deducted but subscription not activated",
    description: "I purchased a monthly subscription yesterday. My bank account was charged, but my account still shows that I am using the free plan."
};

async function aiTest() {
    try {
        const result = await ticketAnalysis.analyzeTicket(dummyTicket);
        console.log("AI ANALYSIS RESULT:");
        console.log(result); 
    } catch (error) {
        console.error("AI ERROR:", error);
    }
}

aiTest()