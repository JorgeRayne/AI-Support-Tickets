import express from 'express';
import { getArticles, createArticle, getArticle, updateArticle } from '../contorllers/articleController.js';


const article = express.Router();

article.post('/', createArticle);
article.get('/', getArticles);
article.get('/:id', getArticle);
article.patch('/:id', updateArticle);


export default article;