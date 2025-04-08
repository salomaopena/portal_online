// models/userModel.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM users WHERE deleted_at IS NULL');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
        return rows[0];
    },
    getByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
        return rows[0];
    },
    create: async (first_name, last_name, email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (first_name, last_name, email, passwd) VALUES (?, ?, ?, ?)', [first_name, last_name, email, hashedPassword]);
        return result.insertId;
    },
    update: async (id, first_name, last_name, email,role) => {
        const [result] = await pool.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ? AND deleted_at IS NULL', [first_name, last_name, email, role, id]);
        return result.affectedRows;
    },
    updatePassword: async (id, newPassword) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await pool.query('UPDATE users SET passwd = ? WHERE id = ? AND deleted_at IS NULL', [hashedPassword, id]);
        return result.affectedRows;
    },
    delete: async (id) => {
        const [result] = await pool.query('UPDATE users SET deleted_at = NOW() WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = User;