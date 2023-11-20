const { MongoClient } = require('mongodb');
var debug = require('debug')('api-sed:db');

const client = new MongoClient("mongodb://localhost:27017");
const base = "db-sed";

async function connection() {
    try {

        await client.connect(); // Conectar a la base de datos
        
        console.log("Connected db");
     

    } catch (e) {
        debug("Error connecting to the db: " + e);
    }
}

connection();

module.exports = { client, base };