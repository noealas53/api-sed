const { Router } = require('express');
const { getAllPubli, deletePubli, addPubli, updatePublic } = require('../controllers/publication.controller');
const { authByRoleId } = require("../middlewares/authorize")

const publicationRouter = Router();

publicationRouter.get('/', getAllPubli);
publicationRouter.delete('/delete/:id', deletePubli);
publicationRouter.post('/create', addPubli);
publicationRouter.put('/update', updatePublic);

module.exports = publicationRouter;