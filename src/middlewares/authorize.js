const { client, base } = require('../config/db');

// se desestructura el objeto user de la solicitud para obtener

exports.authByRoleId = async function (req, res, next) {
  try {
    const { user } = req;

    // Buscar el usuario por su idUser
    const foundUser = await client.db(base).collection('users').findOne({ _id: ObjectId(user._id) });

    // Verificar si el usuario existe y tiene el rol requerido
    if (!foundUser || !foundUser.rols || !foundUser.rols.includes('administrador')) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    // El usuario tiene el rol requerido, permitir el acceso
    next();

  } catch (error) {
    return res.status(500).json({ message: 'Error de servidor' + error });
  }
};