const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ssTbAmory!203CoC?',
    database: 'employee_db',
    port: 3306
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected to database');
});




module.exports = connection;