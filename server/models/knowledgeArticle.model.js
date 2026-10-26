
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
