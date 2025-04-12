// Description: This file defines the API routes for the application, including user authentication, category management, and news management.
const express = require('express')
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const newsController = require('../controllers/newsController');
const commentController = require('../controllers/commentController');
const ratingController =  require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


//Admin routes
router.get('/auth/users', userController.findAllUsers);
router.post('/auth/register', userController.createUser);
router.post('/auth/login',userController.login);
router.get('/auth/user/:id', userController.findUserById);
router.put('/auth/update/:id', userController.updateUser);
router.put('/auth/change-password', authMiddleware.isAuthenticated, userController.changePassword);
router.put('/auth/reset-password', userController.resetPassword);
router.post('/auth/reset-password-request', userController.resetPasswordRequest);
router.put('/auth/delete/:id', userController.deleteUser);
router.get("/auth/logout", userController.logout);

//categories routes
router.get('/categories',categoryController.findAll);
router.get('/categories/:id',categoryController.findById);
router.post('/categories/add',categoryController.createCategory);
router.put('/categories/update/:id',categoryController.updateCategory);
router.put('/categories/delete/:id',categoryController.deleteCategory);


//news routes
router.get('/news',newsController.findAll);
router.get('/news/:id',newsController.findById);
router.post('/news/add',newsController.createNews);
router.put('/news/update/:id',newsController.updateNews);
router.put('/news/delete/:id',newsController.deleteNews);

//comments routes
router.get('/comments',commentController.findAll);
router.get('/comment/:id', commentController.findById)
router.post('/comment/add',commentController.createComment);
router.put('/comment/update/:id',commentController.updateComment);
router.put('/comment/delete/:id',commentController.deleteComment)

//ratings routes

router.get('/ratings',ratingController.findAll)
router.get('/rating/:id',ratingController.findById)
router.post('/rating/add',ratingController.createRating)
router.put('/rating/update/:id',ratingController.findById)
router.put('/rating/delete/:id',ratingController.deleteRating)




module.exports = router;