import KnowledgeArticle from "../models/knowledgeArticle.model.js";

async function searchArticle(searchQuery){
    
    if (!searchQuery || typeof searchQuery !== "string" || !searchQuery.trim()) {
        return [];
    }

    const articles = await KnowledgeArticle.find(
        {
            $text: {
                $search: searchQuery?.trim(),
            },
            isPublished: true,
        },
        {
            score: {
                $meta: "textScore"
            }
        }
    )
    .sort({
        score: {
            $meta: "textScore",
        }
    })
    .limit(5)
    .select('title content tags');

    return articles
}

export default {
    searchArticle,
}