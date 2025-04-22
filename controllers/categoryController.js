const Category = require('../models/categoryModel');

const categoryController = {
    findAll: async (req, res) => {
        try {
            const categories = await Category.getAll();
            res.status(200).json({ status: 200, message: 'success', data: categories });
        } catch (error) {
            res.status(500).json({ stutus: 500, message: 'Erro ao buascar categorias', error: error });
        }
    },
    findById: async (req, res) => {
        try {
            const category = await Category.getById(req.params.id);
            category ? res.status(200).json({ status: 200, message: 'success', data: category }) :
                res.status(404).json({ status: 404, message: 'Categoria não encontrada' });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar categoria', error: error });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { name, slug } = req.body;
            const category = await Category.getByName(name);
            if (category) {
                return res.status(400).json({ status: 400, message: 'Categoria já existe' });
            }
            const id = await Category.create(name, slug);
            res.status(200).json({ status: 200, message: 'Categoria criada com sucesso', data: { id } });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao criar categoria', error: error });
        }
    },
    // Atualiza uma categoria existente
    updateCategory: async (req, res) => {
        try {
            const { name, slug } = req.body;
            const category = await Category.update(req.params.id, name, slug);
            return res.status(200).json({ status: 200, message: 'Categoria atualizada com sucesso', data: category });
        } catch (error) {
            console.error("Controller :", error);
            res.status(500).json({ status: 500, message: 'Erro ao atualizar a categoria ', error });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await Category.delete(req.params.id);
            const categories = await Category.getAll();
            return res.status(200).json({ status: 200, data:categories, message: 'Categoria deletada com sucesso' });
        } catch (error) {
            return res.status(500).json({ status: 500, message: 'Erro ao deletar categoria', error: error });
        }
    }
};

module.exports = categoryController;