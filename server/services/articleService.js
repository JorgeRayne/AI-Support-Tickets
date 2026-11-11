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
    // const article = await KnowledgeArticle.findById(id);

    // return article;
    console.log(id);
}

export default{
    createArticle,
    getArticles,
    getArticle
}