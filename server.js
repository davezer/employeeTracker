const mysql = require('mysql2');
const inquirer = require('inquirer');
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
    userPrompts();
});

// prompt user with list of options to choose from
const userPrompts = () => {
    inquirer.prompt ([
        {
            name: 'action',
            type: 'list',
            message: 'Welcome to the employee database. What would you like to do?',
            choices: [
                    'View all employees',
                    'View all departments',
                    'View all roles',
                    'Add an employee',
                    'Add a department',
                    'Add a role',
                    'Update an employee role',
                    'Delete an employee',
                    'Exit'
            ]
        }
    ]).then((answers) => {
        // console.log(answers);
        const choices = answers.action;
        // console.log(choices);
        // finish this as functions are built
        if (choices === 'View all employees') {
            showEmployees();
        }
        if (choices === 'View all deparments') {
            showDepartments();
        }
        if (choices === 'View all roles') {

        }
        if (choices === 'Add an employee') {
            addEmployee();
        }
        if (choices === 'Add a department') {
            addDepartment();
        }
        if (choices === 'Add a role') {

        }
        if (choices === 'Update and employee role') {

        }
        if (choices === 'Delete an employee') {

        }
        if (choices === 'Exit') {
            exitApp();
        };
    });
};

// view all employees in database
showEmployees = () => {
    console.log('Showing all employees');
    const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department,
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompts();
    })
};

// view all departments in the database

showDepartments = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// view all roles in the database

// add an employee to the database
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name!');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.firstName, answer.lastName]

        // grab roles from roles table
        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employees role?',
                    choices: roles,
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map (({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));
                    //console.log(managers);

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log('Employee has been added to the database!');

                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

// add a department to the database

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department would you like to add?',
            validate: addDepartment => {
                if (addDepartment){
                    return true;  
                } else {
                    console.log('Please enter a department!');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, res) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + ' to departments!');

            showDepartments();
        });
    });
};

// add a role to the database

// update a role

// delete an employee

exitApp = () => {
    connection.end();
};