const Router = require("express");
const userRouter = require("./userRouter");
const publicationRouter = require("./publicationRouter");
const authRouter = require("./authRouter");
const passport = require('passport');

const baseRouter = Router();

baseRouter.use('/api/auth', authRouter);
baseRouter.use('/api/users', passport.authenticate("jwt", { session: false }), userRouter);
baseRouter.use('/api/publications', passport.authenticate("jwt", { session: false }), publicationRouter);

module.exports = baseRouter;