import testServer from "./testServer.js";
import '../models/index.js';
import knowledgeArticleSearch from "../services/knowledgeArticleSearch.js";

const server = async () => {

    await testServer();

    const result = await knowledgeArticleSearch.searchArticle(
        "How to Reset Your Account Password"
    );

    console.log(result);
} 

server()