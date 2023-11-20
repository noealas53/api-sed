const passport = require('passport');
const { ObjectId } = require('mongodb');
const JwtStragety = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { client, base } = require('../config/db'); // Asegúrate de tener la configuración correcta para tu URI de MongoDB

passport.use(
  new JwtStragety(
      {
          secretOrKey: process.env.JWT_SECRET,
          jwtFromRequest: ExtractJwt.fromExtractors([
              ExtractJwt.fromAuthHeaderAsBearerToken(), // sacar el token desde el header de autorizacion y siempre sera un bearer token
          ])
      },
      async (payload, done) => {
          try {

              const userId = new ObjectId(payload.idUser);

              // Buscar el usuario por su _id
              const user = await client.db(base).collection('users').findOne({ "_id": userId });
              
              if (!user) {
                return done(null, false); // El usuario no fue encontrado
              }
      
              return done(null, user); // La autenticación fue exitosa, se pasa el usuario al siguiente middleware
      
            } catch (error) {
              return done(error, false); // Ocurrió un error durante la verificación de la autenticación
            }
      }
  )
)
