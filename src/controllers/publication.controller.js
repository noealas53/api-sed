const { client, base } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllPubli = async(req, res) => {

    try {
        const collection = client.db(base).collection('publications'); 

        const publications = await collection.find({}).toArray();

        return res.status(200).json({ body: publications });
        
    } catch (error) {
        return res.status(500).json({ message: "error getting data: " + error})
    }

}

exports.deletePubli = async (req, res) => {
    try {

        const { id } = req.params;

        const collection = client.db(base).collection('publications'); 

        // Convertir la cadena id a ObjectId
        const publicationsId = new ObjectId(id);

        // Buscar por su _id
        const publication = await collection.findOne({ "_id": publicationsId });

        // Verificar si existe
        if (!publication) {
            return res.status(404).json({ message: "Publication not found." });
        }

        // Eliminar
        const result = await collection.deleteOne({ "_id": publicationsId });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Publication deleted successfully." });
        } else {
            return res.status(500).json({ message: "Error deleting publication." });
        }
    }catch (error) {
        return res.status(500).json({ message: "Error deleting publication: " + error.message });
    }
};

exports.addPubli = async (req, res) => {
    try {
        const { url, name, price, description, category, state } = req.body;
    
        // Verificar si hay campos vacíos
        if ( !url || !name || !price || !description || !category || !state)
          return res.status(400).json({ message: 'All fields are required' });

        
        // Creación del nuevo usuario
        await client.db(base).collection('publications').insertOne({
            url,
            name,
            price,
            description,
            category,
            state,
        });
    
        res.status(201).json({ message: 'Publication created successfully' });
    
      } catch (error) {
        res.status(500).json({ message: 'Error creating post: ' + error });
      }
};

exports.updatePublic = async (req, res) => {
    try {
        const { idPublicacion, idUser, url, name, price, description, category, state } = req.body;

        if (!idPublicacion || !idUser || !url || !name || !price || !description || !category || !state)
          return res.status(400).json({ message: 'All fields are required' });
        
        const userId = new ObjectId(idUser);
        const publicationId = new ObjectId(idPublicacion);

        // Buscar el usuario por su _id
        const user = await client.db(base).collection('users').findOne({ "_id": userId });

        if(!user)
            return res.status(400).json({ message: 'User not found' });

        // Buscar la publicacion por su _id
        const publication = await client.db(base).collection('publications').findOne({ "_id": publicationId });

        if(!publication)
            return res.status(400).json({ message: 'Publication not found' });

        const collection = client.db(base).collection('publications'); 

        await collection.updateOne(
            { _id: publicationId }, 
            { 
                $set: {
                    userId: userId,
                    url: url,
                    name: name,
                    price: price,
                    description: description,
                    category: category,
                    state: state
                } 
            }
        );

        return res.status(200).json({ message: "Post successfully updated." });
        
    } catch (error) {
        return res.status(500).json({ message: "Error updating post: " + error });
    }
};