const db = require("../db/connection");
const data = require("../db/data/development-data/index");

const articleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

const allArticles = () => {
  return db
    .query(
      `SELECT articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
     ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const allComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id=$1
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = { articleId, allArticles, allComments };