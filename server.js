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
    console.log('connected to database');
});

// prompt user with list of options to choose from
function options() {
    inquirer.prompt ({
        name: 'action',
        type: 'list',
        message: 'Welcome to the employee database. What would you like to do?',
        choices: [
                'View all employees',
                'view all departments',
                'View all roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update an employee role',
                'Delete an employee',
                'Exit'
        ]
    }).then(function (answer) {
        // finish this when functions are built
    })
}

// view all employees in database

// view all departments in the database

// view all roles in the database

// add an employee to the database

// add a department to the database

// add a role to the database

// update a role

// delete an employee