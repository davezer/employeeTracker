const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'employee_db',
    port: 3306
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id');
});

// prompt user with list of options to choose from

// view all employees in database

// view all departments in the database

// view all roles in the database

// add an employee to the database

// add a department to the database

// add a role to the database

// update a role

// delete an employee