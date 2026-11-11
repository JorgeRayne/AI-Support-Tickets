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
        const articles = await articleService.getArticles();

        if(!articles || articles.length === 0) {
            return res.status(404).status({
                message: "false",
                article: "No article found."
            })
        }

        return res.status(200).json({
            message: 'succes',
            article: articles
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

// async function getArticles(req, res) {
//     try {
//         const articles = await articleService.getArticles();

//         if (!articles || articles.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No articles found."
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Articles retrieved successfully.",
//             data: articles
//         });

//     } catch (error) {
//         console.error("Get articles error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error."
//         });
//     }
// }

async function getArticle(req, res) {
    const ticket = req.params

    console.log(ticket)
    
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