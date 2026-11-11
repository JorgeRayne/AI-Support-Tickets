import express from 'express';
import { getArticles, createArticle } from '../contorllers/articleController.js';


const article = express.Router();

article.post('/', createArticle);
article.get('/', getArticles);
article.get('/:id', getArticles);


export default article;