
import mongoose from "mongoose";

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    searchableContent: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isPublished: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const KnowledgeArticle = mongoose.model(
  "KnowledgeArticle",
  knowledgeArticleSchema
);

export default KnowledgeArticle;
