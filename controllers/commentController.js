const Comment = require('../models/commentsModel');

const CommentController = {
    findAll: async (req, res) => {
        try {
            const comments = await Comment.getAll();
            res.status(200).json({ status: 200, message: 'success', data: comments });
        } catch (error) {
            res.status(500).json({ stutus: 500, message: 'Erro ao buascar comentários', error: error });
        }
    },
    findById: async (req, res) => {
        try {
            const comment = await Comment.getById(req.params.id);
            comment ? res.status(404).json({ status: 404, message: 'Comentário não encontrado' }) :
                res.status(200).json({ status: 200, message: 'success', data: comment });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar comentário', error: error });
        }
    },

    createComment: async (req, res) => {
        try {
            const { user_id, news_id, comment } = req.body;
            const comments = await Comment.getByUserAndNews(user_id, news_id);
            if (comments) {
                return res.status(409).json({ status: 409, message: 'Comentário já existe' });
            }
            const id = await Comment.create(user_id, news_id, comment);
            res.status(200).json({ status: 200, message: 'Comentário criado com sucesso', data: { id } });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao criar comentário', error: error });
        }
    },

    updateComment: async (req, res) => {
        try {
            const { user_id, news_id, comment } = req.body;
            const comments = await Comment.update(req.params.id, user_id, news_id, comment);
            if (comments) {
                return res.status(200).json({ status: 200, message: 'Comentário atualizado com sucesso' });
            } else {
                return res.status(404).json({ status: 404, message: 'Comentário não encontrado' });
            }

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao atualizar comentário', error: error });
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await Comment.delete(req.params.id);
            if (comment) {
                res.status(200).json({ status: 200, message: 'Comentário deletado com sucesso' });
            } else {
                return res.status(404).json({ status: 404, message: 'Comentário não encontrado' });
            }

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao deletar comentário', error: error });
        }
    }
};

module.exports = CommentController;