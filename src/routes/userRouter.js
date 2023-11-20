const { Router } = require('express');
const { getAllUsers, deleteUser, addUser, updateUser } = require('../controllers/users.controller');
const { authByRoleId } = require("../middlewares/authorize")

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.delete('/delete/:id', deleteUser);
userRouter.post('/create', addUser);
userRouter.put('/update', updateUser);

module.exports = userRouter;