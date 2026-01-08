const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database configuration info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialise express app
const app = express();
//help us read json
app.use(express.json());

//starting server
app.listen(port, () => console.log(`Server started on port ${port}`));

//get all fruits
app.get('/allfruits', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.fruits');
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allfruits'});
    }
});

//add fruit
app.post('/addfruit', async (req, res) => {
    const {fruit_name, fruit_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute ('INSERT INTO fruits (fruit_name, fruit_pic) VALUES (?,?)', [fruit_name, fruit_pic]);
        res.status(201).json({message: 'Fruit' + fruit_name + 'Successfully added'});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add fruit '+ fruit_name});
    }
});