const News = require('../models/newsModel');


const newsController = {
    findAll: async (req, res) => {
        try {
            const news = await News.getAll();
            res.status(200).json({ status: 200, message: "success", news: news });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar notícias ' + error });
        }
    },

    findById: async (req, res) => {
        try {
            const news = await News.getById(req.params.id);
            news ? res.status(200).json({ status: 200, message: "Notícia encontrada", news: news }) :
                res.status(404).json({ status: 404, message: "Notícia não encontrada." });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar notícia', error });
        }
    },

    createNews: async (req, res) => {
        try {
            const { title, slug, content, category_id, author_id } = req.body;
            const existeNews = await News.getBySlug(slug);
            if (existeNews) {
                return res.status(400).json({ status: 400, message: 'Categoria já cadastrada' });
            }
            const id = await News.create(title, slug, content, category_id, author_id);
            res.status(200).json({ status: 200, message: 'Notícia criada com sucesso', title, slug, content, category_id, author_id });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao criar notícia ', error: error });
        }
    },

    updateNews: async (req, res) => {
        try {
            const { title, slug, content, category_id, author_id } = req.body;
            const result = await News.update(req.params.id, title, slug, content, category_id, author_id);
            if (result) {
                res.status(200).json({ status: 200, message: 'Notícia atualizada com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Notícia não encontrada ou nenhuma alteração feita' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao atualizar a notícia ', error });
        }
    },

    deleteNews: async (req, res) => {
        try {
            const result = await News.delete(req.params.id);
            if (result) {
                res.status(200).json({ status: 200, message: 'Notícia excluída com sucesso' });
            } else {
                res.status(400).json({ status: 400, message: 'Notícia não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao excluir categoria ', error });
        }
    }
};

module.exports = newsController;