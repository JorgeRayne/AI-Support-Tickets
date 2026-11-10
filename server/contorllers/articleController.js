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
    try {
        const article = await articleService.getArticles();

        if(article.length === 0 || !article) {
            res.status(404).status({
                message: "success",
                article: "No article found."
            })
        }

        res.status(200).json({
            message: 'succes',
            article: article
        })
    } catch (error) {
        res.status(404).json({
            message:"failde"
        });
    }
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