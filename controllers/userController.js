const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const userController = {
    findAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.status(200).json({ status: 200, message: "success", users: users });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar usuários' + error });
        }
    },

    findUserById: async (req, res) => {
        try {
            const user = await User.getById(req.params.id);
            user ? res.status(200).json({ status: 200, message: "Usuário encontrado", user: user }) :
                res.status(404).json({ status: 404, message: "Usuário não encontrado." });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar usuário', error });
        }
    },

    createUser: async (req, res) => {
        try {
            const { first_name, last_name, email, passwd } = req.body;
            const existingUser = await User.getByEmail(email);
            if (existingUser) {
                return res.status(400).json({ status: 400, message: 'E-mail já cadastrado' });
            }
            const id = await User.create(first_name, last_name, email, passwd);
            res.status(200).json({ status: 200, message: 'Usuário criado com sucesso', id, first_name, last_name, email });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao criar usuário ', error: error });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { first_name, last_name, email } = req.body;
            const result = await User.update(req.params.id, first_name, last_name, email);
            if (result) {
                res.status(200).json({ status: 200, message: 'Usuário atualizado com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Usuário não encontrado ou nenhuma alteração feita' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao atualizar usuário', error });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const result = await User.delete(req.params.id);
            if (result) {
                res.status(200).json({ status: 200, message: 'Usuário deletado com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao deletar usuário', error });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { id, newPassword } = req.body;
            const result = await User.updatePassword(id, newPassword);
            if (result) {
                res.status(200).json({ status: 200, message: 'Senha alterada com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao alterar senha', error });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            const decoded = jwt.verify(token, SECRET_KEY);
            const result = await User.updatePassword(decoded.id, newPassword);
            if (result) {
                res.status(200).json({ status: 200, message: 'Senha redefinida com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Usuário não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao redefinir senha', error });
        }
    },
    resetPasswordRequest: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.getByEmail(email);
            if (!user) {
                return res.status(400).json({ status: 400, message: 'E-mail não encontrado' });
            }
            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
            const resetLink = `${process.env.BASE_URL}/users/reset-password/${token}`;

            await transporter.sendMail({
                from: '',
                to: email,
                subject: 'Redefinição de Senha',
                html: `Você solitou redefinição da senha? <a href="${resetLink}"> Clique no link para redefinir sua senha </a> <br>${token}`

            });

            res.status(200).json({ status: 200, message: 'E-mail de redefinição de senha enviado' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao solicitar redefinição de senha', error });
        }
    },

    login: async (req, res) => {
        try {
            const { email, passwd } = req.body;
            const user = await User.getByEmail(email);
            if (!user || !(await bcrypt.compare(passwd, user.passwd))) {
                return res.status(400).json({ status: 400, message: 'Credenciais inválidas' });
            }
            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
            
            // **Verificar se req.session existe antes de atribuir**
            if (!req.session) {
                return res.status(500).json({ status: 500, message: "Erro na sessão" });
            }
            
            req.session.user = user;
            req.session.token = token; // Armazena o token na sessão

            await User.updateToken(user.id, token); // Atualiza o token no banco de dados

            res.json({ message: 'Você acessou o sistema com sucesso', token });

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao fazer login', error });
        }
    },

    logout: async(req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao encerrar sessão" });
            }
            req.session = null;
            res.clearCookie("connect.sid"); // Remove o cookie da sessão
            res.json({ message: "Sessão encerrada com sucesso!" });
        });
    }
};


module.exports = userController;