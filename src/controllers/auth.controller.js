const jwt = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { client, base } = require('../config/db');

// creacion del token
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password)
        return res.status(400).json({ message: 'Enter complete data' });

        const user = await client.db(base).collection('users').findOne({ email });

        if (!user)
        return res.status(404).json({ message: 'Invalid credentials' });

        if (!(await bcrypt.compare(password, user.password)))
        return res.status(404).json({ message: 'Invalid credentials' });

        const token = jwt.signToken({ idUser: user._id });

        return res.status(token ? 200 : 404).json({ token });

            
    } catch (error) {
        return res.status(500).json({
            message: ('Error: ' + error)
          });
    }

}

exports.register = async (req, res) => {
    try {
      const { name, lastName, email, password, confirmPassword, phone, rol } = req.body;
  
      // Verificar si hay campos vacíos
      if (!name || !lastName || !email || !password || !confirmPassword || !phone)
        return res.status(400).json({ message: 'All fields are required' });
  
      // verificar si el correo ya ha sido utilizado
      const existingUser = await client.db(base).collection('users').findOne({ email });
  
      if (existingUser)
        return res.status(400).json({ message: 'Email is already in use' });
  
      // Validando 8 caracteres para la contraseña
      if (password.length < 8 || confirmPassword.length < 8)
        return res.status(400).json({ message: 'Enter 8 or more characters for the password' });
  
      // Verificando que las contraseñas coincidan
      if (password !== confirmPassword)
        return res.status(400).json({ message: 'Passwords do not match' });
  
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
  
      res.status(201).json({ message: 'Successfully created user' });
  
    } catch (error) {
      res.status(500).json({ message: 'Error creating user: ' + error });
    }
  };