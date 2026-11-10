import mongoose from "mongoose";
import articleService from "../services/articleService.js"

async function createArticle(req, res) {
    const articleBody = {...req.body}
    const user = req.user;
    console.log(user)
    
    try {
        const newArticle = await articleService.createArticle(
            articleBody,
            user
        );

        return res.status(201).json({
            success: true,
            article: newArticle
        });

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

async function getArticles(req, res) {
    console.log('asdfasdf')
}

async function getArticle(req, res) {
    
}

async function updateArticle(req, res) {
    
}

async function deleteArtcile(req, res) {
    
}

async function searchArticle(req, res) {
    
}

export {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArtcile,
    searchArticle,
}