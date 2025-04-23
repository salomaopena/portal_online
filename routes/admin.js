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
router.get('/', middleware.isAuthenticated, (req, res) => {
    const isAdmin = req.session.user.role === 'admin';
    const totalUsers = 25; // Simulado
    const totalNews = 78;
    const recentAccess = "Hoje, 10:30";
    // Verifica se o usuário está autenticado
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render('admin/dashboard', {
        user: req.session.user,
        isAdmin,
        totalUsers,
        totalNews,
        recentAccess
    });

});




//register
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, passwd } = req.body;
    // Verifica se todos os campos estão preenchidos

    if (!first_name || !last_name || !email || !passwd) {
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
        //console.log(response.data)
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


router.get("/logout", middleware.isAuthenticated, (req, res) => {
    // Limpa a sessão
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).render('admin/dashboard', {
                error: 'Erro ao fazer logout.'
            });
        }
        // Redireciona para a página de login
        res.redirect('/login');
    });
});

//forgot password


//listar categorias
router.get('/categories', middleware.isAuthenticated, async (req, res) => {
    try {
        const response = await api.get('/categories'); // Faz requisição GET na API
        // Verifica se a requisição foi bem-sucedida
        if (response.status !== 200) {
            return res.render('admin/categories/list', { error: 'Erro ao buscar categorias.' });
        }
        // Renderiza a página com os dados retornados

        res.render('admin/categories/list', {
            categories: response.data.data, // Passa os dados para o Handlebars
            title: "Categorias",
            user: req.session.user,
        }); // Envia os  para o Handlebars
    } catch (error) {
        res.render('admin/categories/list', { error: "Erro ao buscar categoria" });
    }
});


//buscar o formulário de adição de categorias
router.get('/categories/new', middleware.isAuthenticated, (req, res) => {
    res.render('admin/categories/add', {
        user: req.session.user,
    });
});


//Adicionar categoria
router.post('/categories/add', async (req, res) => {
    const { name, slug } = req.body;
    // Verifica se todos os campos estão preenchidos
    if (!name || !slug) {
        return res.render('admin/categories/edit', {
            error: 'Preencha todos os campos.'
        });
    }

    try {
        const response = await api.post('/categories/add', { name, slug });
        res.render('admin/categories/add', {
            success: response.data.message || 'Categoria adicionada com sucesso!'
        });
    } catch (error) {
        console.log(error)
        res.render('admin/categories/add', {
            error: error.response?.data?.message || 'Erro ao adicionar categoria.'
        });
    }
});


router.post('/categories/edit/:id', middleware.isAuthenticated, async (req, res) => {
    const { id } = req.params;
    // Verifica se o ID da categoria foi fornecido
    if (!id) {
        return res.render('admin/categories/edit', {
            error: 'ID da categoria não fornecido.'
        });
    }

    try {
        const response = await api.get(`/categories/${id}`);
        const category = response.data.data;
        res.render('admin/categories/edit',
            { category: category, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.render('admin/categories/edit', {
            error: error.message || 'Erro ao buscar categoria.',
        });
    }
});


//editar categoria
router.post('/categories/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        // Verifica se todos os campos estão preenchidos
        const response = await api.put(`/categories/update/${id}`, { name, slug });

        res.render('admin/categories/edit', {
            category: response.data.data, // Passa os dados atualizados para o Handlebars
            success: response.data.message || 'Categoria atualizada com sucesso!'
        });
    } catch (error) {
        res.render('admin/categories/edit', {
            error: error.response?.data?.message || 'Erro ao atualizar categoria.'
        });
    }
});


//deletar categoria
router.get('/categories/delete/:id', async (req, res) => {
    const { id } = req.params;
    // Verifica se o ID da categoria foi fornecido
    if (!id) {
        return res.render('admin/categories/list', {
            error: 'ID da categoria não fornecido.'
        });
    }

    try {
        const response = await api.put(`/categories/delete/${id}`);
        res.render('admin/categories/list', {
            categories: response.data.data, // Passa os dados atualizados para o Handlebars
            success: response.data.message || 'Categoria deletada com sucesso!',
        });
    } catch (error) {
        console.error(error);
        res.render('admin/categories/list', {
            error: error.response?.data?.message || 'Erro ao deletar categoria.',
        });
    }
});



//listar notícias
router.get('/news', middleware.isAuthenticated, async (req, res) => {
    try {
        const response = await api.get('/news'); // Faz requisição GET na API
        // Verifica se a requisição foi bem-sucedida
        if (response.status !== 200) {
            return res.render('admin/news/list', { error: 'Erro ao buscar notícias.' });
        }
        // Renderiza a página com os dados retornados

        res.render('admin/news/list', {
            news: response.data.news, // Passa os dados para o Handlebars
            title: "Notícias",
            user: req.session.user,
        }); // Envia os  para o Handlebars
    } catch (error) {
        res.render('admin/news/list', { error: "Erro ao buscar notícias" });
    }
});


//buscar o formulário de adição de notícias
router.get('/news/new', middleware.isAuthenticated, (req, res) => {
    res.render('admin/news/add', {
        title: "Adicionar Notícias",
        user: req.session.user,
    });
});

//Adicionar notícias

router.post('/news/add', async (req, res) => {
    const { title, content, category } = req.body;
    // Verifica se todos os campos estão preenchidos
    if (!title || !content || !category) {
        return res.render('admin/news/add', {
            error: 'Preencha todos os campos.'
        });
    }

    try {
        const response = await api.post('/news/add', { title, content, category });
        res.render('admin/news/add', {
            success: response.data.message || 'Notícia adicionada com sucesso!'
        });
    } catch (error) {
        console.log(error)
        res.render('admin/news/add', {
            error: error.response?.data?.message || 'Erro ao adicionar notícia.'
        });
    }
});


module.exports = router;