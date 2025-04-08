const Rating = require('../models/ratingsModel');

const RatingController = {
    findAll: async (req, res) => {
        try {
            const ratings = await Rating.getAll();
            res.status(200).json({ status: 200, message: 'success', data: ratings });
        } catch (error) {
            res.status(500).json({ stutus: 500, message: 'Erro ao buascar avaliações', error: error });
        }
    },
    findById: async (req, res) => {
        try {
            const rating = await Rating.getById(req.params.id);
            rating ? res.status(404).json({ status: 404, message: 'Avaliação não encontrada' }) :
                res.status(200).json({ status: 200, message: 'success', data: rating });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao buscar avaliação', error: error });
        }
    },

    createRating: async (req, res) => {
        try {
            const { user_id, news_id, rating } = req.body;
            const ratings = await Rating.getRatingByUserAndNews(user_id, news_id);
            if (ratings) {
                return res.status(409).json({ status: 409, message: 'Avaliação já existe' });
            }
            const id = await Rating.create(user_id, news_id, rating);
            res.status(200).json({ status: 200, message: 'Avaliação criada com sucesso', data: { id } });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao criar avaliação', error: error });
        }
    },

    updateRating: async (req, res) => {
        try {
            const { user_id, news_id, rating } = req.body;
            const ratings = await Rating.update(req.params.id, user_id, news_id, rating);
            if (ratings) {
                return res.status(200).json({ status: 200, message: 'Avaliação atualizada com sucesso' });
            } else {
                return res.status(404).json({ status: 404, message: 'Avaliação não encontrada' });
            }

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao atualizar avaliação', error: error });
        }
    },

    deleteRating: async (req, res) => {
        try {
            const rating = await Rating.delete(req.params.id);
            if (rating) {
                res.status(200).json({ status: 200, message: 'Avaliação deletada com sucesso' });
            } else {
                return res.status(404).json({ status: 404, message: 'Avaliação não encontrada' });
            }

        } catch (error) {
            res.status(500).json({ status: 500, message: 'Erro ao deletar avaliação', error: error });
        }
    }
};

module.exports = RatingController;