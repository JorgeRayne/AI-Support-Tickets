
import mongoose from "mongoose";

const aiInteractionSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    modelOutput: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    agentFeedback: {
      type: String,
      enum: ["accepted", "edited", "rejected"],
      default: null,
    },

    feedbackComment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AIInteraction = mongoose.model(
  "AIInteraction",
  aiInteractionSchema
);

export default AIInteraction;
