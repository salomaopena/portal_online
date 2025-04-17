const express = require('express')
const middleware = require("../middleware/authMiddleware");
const axios = require('axios');


const API_URL = 'http://localhost:3000/api';

const router = express.Router();

// Criar instância do axios com a URL base da API
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000,
});


// Middleware para verificar se o usuário está autenticado

//dashboard
router.get('/', middleware.isAuthenticated,(req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render('admin/dashboard', {
        user: req.session.user,
    });

});

//register
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, passwd } = req.body;
    // Verifica se todos os campos estão preenchidos

    if (!first_name || !last_name || !email || !passwd) {
        console.log({ first_name: first_name, last_name: last_name, message: 'Dentro do IF' })
        return res.render('admin/auth/register', {
            error: 'Preencha todos os campos.'
        });
    }

    // Verifica se o email é válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('admin/auth/register', {
            error: 'Email inválido.'
        });
    }
    // Verifica se a senha atende aos requisitos
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(passwd)) {
        return res.render('admin/auth/register', {
            error: 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.'
        });
    }
    // Enviar os dados para a base de dados
    try {
        const response = await api.post('/auth/register', {
            first_name,
            last_name,
            email,
            passwd
        });

        // Verifica se o registro foi bem-sucedido
        if (response.status !== 200) {
            return res.render('admin/auth/register', {
                error: 'Erro ao registrar usuário.'
            });
        }

        // Registro OK — renderiza com alerta de sucesso
        console.log(response.data)
        res.render('admin/auth/register', {
            success: response.data.message || 'Usuário registrado com sucesso!'
        });
    } catch (error) {
        const msg = error.response?.data?.message || 'Erro ao registrar usuário.';
        console.error(error);
        res.render('admin/auth/register', {
            error: msg
        });
    }
});

//login
router.post('/login', async (req, res) => {
    const { email, passwd } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!email || !passwd) {
        return res.render('admin/auth/login', {
            error: 'Preencha todos os campos.'
        });
    }

    // Enviar os dados para a base de dados
    try {
        const response = await api.post('/auth/login', { email, passwd }, { withCredentials: true });

        // Verifica se o login foi bem-sucedido
        if (response.status !== 200) {
            return res.render('admin/auth/login', {
                error: 'Erro ao fazer login.'
            });
        }

        // Armazena o token e os dados do usuário na sessão
        req.session.token = response.data.token;
        req.session.user = response.data.user;
        req.session.save(); // Salva a sessão

        // Login OK — renderiza com alerta de sucesso
        res.render('admin/auth/login', {
            success: response.data.message || 'Login realizado com sucesso!'
        });

    } catch (error) {
        const msg = error.response?.data?.message || 'Erro ao fazer login.';
        console.error(error);
        res.render('admin/auth/login', {
            error: msg
        });
    }
});

router.get("/lo", (req, res) => {
    if (req.session.user) {
        res.json({ status: "Sessão ativa", user: req.session.user });
    } else {
        res.json({ status: "Nenhum usuário na sessão" });
    }
});


module.exports = router;