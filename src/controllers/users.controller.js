const { client, base } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllUsers = async(req, res) => {

    try {
        const collection = client.db(base).collection('users'); 

        const users = await collection.find({}).toArray();

        return res.status(200).json({ body: users });
        
    } catch (error) {
        return res.status(500).json({ message: "error getting data: " + error})
    }

}

exports.deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const collection = client.db(base).collection('users'); 

        // Convertir la cadena id a ObjectId
        const userId = new ObjectId(id);

        // Buscar el usuario por su _id
        const user = await collection.findOne({ "_id": userId });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Eliminar el usuario
        const result = await collection.deleteOne({ "_id": userId });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "User deleted successfully." });
        } else {
            return res.status(500).json({ message: "Error deleting user." });
        }
    }catch (error) {
        return res.status(500).json({ message: "Error deleting user: " + error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, lastName, email, password, confirmPassword, phone, rol } = req.body;
    
        // Verificar si hay campos vacíos
        if (!name || !lastName || !email || !password || !confirmPassword || !phone)
          return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    
        // verificar si el correo ya ha sido utilizado
        const existingUser = await client.db(base).collection('users').findOne({ email });
    
        if (existingUser)
          return res.status(400).json({ message: 'El correo ya está en uso' });
    
        // Validando 8 caracteres para la contraseña
        if (password.length < 8 || confirmPassword.length < 8)
          return res.status(400).json({ message: 'Ingrese 8 o más caracteres para la contraseña' });
    
        // Verificando que las contraseñas coincidan
        if (password !== confirmPassword)
          return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    
        // Hashing de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Creación del nuevo usuario
        await client.db(base).collection('users').insertOne({
          name,
          lastName,
          email,
          password: hashedPassword,
          phone,
          rol,
        });
    
        res.status(201).json({ message: 'Usuario creado correctamente' });
    
      } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario: ' + error });
      }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, rol } = req.body;

        const collection = client.db(base).collection('users'); 

        await collection.updateOne(
            { username: username }, // Filtro: Busca un usuario por su nombre de usuario actual
            { $set: { rol: rol } } // Actualización: Establece el nuevo rol
        );

        return res.status(200).json({ message: "User update successfully." });
        
    } catch (error) {
        return res.status(500).json({ message: "Error update user: " + error });
    }
};