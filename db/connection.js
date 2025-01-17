const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Create a simple connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.message);
//         return;
//     }
//     console.log('Connected to the database');
// });

module.exports = db;

