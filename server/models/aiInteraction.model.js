
import mongoose from "mongoose";

const aiInteractionSchema = new mongoose.Schema(
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true
        },

        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        provider: {
            type: String,
            default: "gemini"
        },

        model: {
            type: String,
            required: true
        },

        analysis: {
            category: {
                type: String,
                enum: [
                    "account_access",
                    "billing",
                    "technical_issue",
                    "bug_report",
                    "other"
                ],
                required: true
            },

            suggestedPriority: {
                type: String,
                enum: ["low", "medium", "high", "urgent"],
                required: true
            },

            summary: {
                type: String,
                required: true
            },

            reasoning: {
                type: String,
                required: true
            }
        },

        suggestedResponse: {
            type: String,
            default: null
        },

        feedback: {
            status: {
                type: String,
                enum: ["pending", "accepted", "edited", "rejected"],
                default: "pending"
            },

            comment: {
                type: String,
                default: ""
            },

            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            }
        }
    },
    { timestamps: true }
);

const AIInteraction = mongoose.model(
    "AIInteraction",
    aiInteractionSchema
);

export default AIInteraction;
