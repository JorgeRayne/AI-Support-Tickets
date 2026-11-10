import express from 'express';
import { getArticles, createArticle } from '../contorllers/articleController.js';


const article = express.Router();

article.post('/', createArticle);


export default article;