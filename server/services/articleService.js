import mongoose from 'mongoose';
import KnowledgeArticle from '../models/knowledgeArticle.model.js'

async function createArticle(body, user) {
    const article = new KnowledgeArticle({
        title: body.title,
        content: body.content,
        tags: body.tags,
        isPublished: body.isPublished,
        createdBy: user.sub
    });

    await article.validate();
    await article.save();

    return article;
}

async function getArticles() {
    const article = await KnowledgeArticle.find();

    return article;
};

async function getArticle(id){
    const article = await KnowledgeArticle.findById(id);

    return article;
}

async function updateArticle(id, body){

    const toChangeArticle = await KnowledgeArticle.findById(id); 

    if (!toChangeArticle) {
        throw new Error("Article not found.");
    }

    const allowedFields = [
        "title",
        "content",
        "tags",
        "isPublished"
    ]

    const updates = {};

    Object.keys(body).forEach(field => {
        if(allowedFields.includes(field)) {
            updates[field] = body[field]
        }
    });

    if (Object.keys(updates).length === 0) {
        throw new Error("No valid fields provided for update.");
    }

    const article = await KnowledgeArticle.findByIdAndUpdate(id,
        {
            $set: updates
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    )

    return article;
}

async function deleteArtcile(id) {
    const articleToDelete = await KnowledgeArticle.findByIdAndDelete(id)

    if (!articleToDelete) {
        const error = new Error("Article not found.");
        error.statusCode = 404;
        throw error;
    }

    return articleToDelete;          
}

export default{
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArtcile,
}