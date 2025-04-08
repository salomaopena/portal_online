const pool = require('../config/db');

const RatingsModel = {
    getAllRatings: async () => {
        const [rows] = await pool.query('SELECT * FROM ratings');
        return rows;
    },
    
    getRatingById: async (id) => {
        const query = 'SELECT * FROM ratings WHERE id = ? AND deleted_at IS NULL';
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    },

    getRatingByUserAndNews: async (user_id, news_id) => {
        const query = 'SELECT * FROM ratings WHERE user_id = ? AND news_id = ? AND deleted_at IS NULL';
        const [rows] = await pool.query(query, [user_id, news_id]);
        return rows[0];
    },
    
    createRating: async (user_id, news_id, rating) => {
        const query = 'INSERT INTO ratings (user_id, news_id, rating) VALUES (?, ?, ?)';
        const [result] = await pool.query(query, [user_id, news_id, rating]);
        return result.insertId;
    },
    
    updateRating: async (id, user_id,news_id , rating) => {
        const query = 'UPDATE ratings SET user_id = ?, news_id = ?, rating = ? WHERE deleted_at IS NULL id = ?';
        await pool.query(query, [user_id, news_id, rating, id]);
    },
    
    deleteRating: async (id) => {
        const query = 'UPDATE ratings SET deleted_at = NOW() WHERE id = ';
        await pool.query(query, [id]);
    },
};

module.exports = RatingsModel;