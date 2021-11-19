const { Router } = require('express');
const userRouter = Router();
const { requiresAuth } = require('express-openid-connect');

userRouter.get('/profile', requiresAuth(), (req, res) => {});
userRouter.get('/:id', requiresAuth(), (req, res) => {
    const { id } = req.params;
});
userRouter.get('/list', requiresAuth(), (req, res) => {});
userRouter.post('/register', requiresAuth(), (req, res) => {
    const { body } = request;
});
module.exports = { path: '/user', router: userRouter };
