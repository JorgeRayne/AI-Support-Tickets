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

    return article;
}

async function getArticles() {
    const article = await KnowledgeArticle.find();

    return article;
};

export default{
    createArticle,
    getArticles
}