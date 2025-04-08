const pool = require('../config/db');

const Comments = {  
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM comments WHERE deleted_at IS NULL');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM comments WHERE deleted_at IS NULL AND id = ?', [id]);
        return rows[0];
    },

    getByUserAndNews: async (user_id, post_id) => {
        const [rows] = await pool.query('SELECT * FROM comments WHERE deleted_at IS NULL AND user_id =? AND news_id = ?', [user_id, post_id]);
        return rows[0];
    },

    create: async (comment, user_id, post_id) => {
        const [result] = await pool.query('INSERT INTO comments (comment, user_id, news_id) VALUES (?, ?, ?)', [comment, user_id, post_id]);
        return result.insertId;
    },

    update: async (id, comment) => {
        await pool.query('UPDATE comments SET comment = ? WHERE deleted_at IS NULL AND id = ?', [comment, id]);
    },

    delete: async (id) => {
        await pool.query('UPDATE comments SET deleted_at = NOW() WHERE id = ?', [id]);
    }
};

module.exports = Comments;