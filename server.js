const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const connection = require('./config/connection');

require('dotenv').config();



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
                    'Update an employee manager',
                    'Delete an employee',
                    'Delete a department',
                    'Delete a role',
                    'Exit'
            ]
        }
    ]).then((answers) => {
        console.log(answers);
        const choices = answers.action;
        // console.log(choices);
        // finish this as functions are built
        if (choices === 'View all employees') {
            showEmployees();
        }
        if (choices === 'View all departments') {
            showDepartments();
        }
        if (choices === 'View all roles') {
            showRoles();
        }
        if (choices === 'Add an employee') {
            addEmployee();
        }
        if (choices === 'Add a department') {
            addDepartment();
        }
        if (choices === 'Add a role') {
            addRole();
        }
        if (choices === 'Update an employee role') {
            updateEmployee();
        }
        if (choices === 'Update an employee manager') {
            updateManager();
        }
        if (choices === 'Delete an employee') {
            deleteEmployee();
        }
        if (choices === 'Delete a department') {
            deleteDepartment();
        }
        if (choices === 'Delete a role') {
            deleteRole();
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
        userPrompts();
    });
};

// view all roles in the database
showRoles = () => {
    console.log('Showing all roles');
    const sql = `SELECT role.id, role.title, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;

        console.table(rows);
        userPrompts();
    });
};

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
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Which role would you like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role',
            validate: addSalary => {
                if (addSalary) {
                    return true;  
                } else {
                    console.log('Please add a salary');
                    return false;
                }
            } 
        }
        
    ]).then(answer => {
        const params = [answer.role, answer.salary];

        const roleSql = `SELECT name, id FROM department`;

        connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?)`;

                connection.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log ('Added ' + answer.role + 'to roles.');

                    showRoles();
                });
            });
        });
    });
};

// update an employee role
updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
        if (err) throw err; 
  
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = []; 
            params.push(employee);
    
            const roleSql = `SELECT * FROM role`;
  
            connection.query(roleSql, (err, data) => {
                if (err) throw err; 
    
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                
                inquirer.prompt([
                    {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's new role?",
                    choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role); 
                    
                    let employee = params[0]
                    params[0] = role
                    params[1] = employee 
                    
    
                    // console.log(params)
    
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    
                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated!");
                        
                        showEmployees();
                    });
                });
            });
        });
    });
};

// update an employee manager
updateManager = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
        if (err) throw err; 
  
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: "Which employee would you like to update?",
                    choices: employees
                }
            ]).then(empChoice => {
                const employee = empChoice.name;
                const params = []; 
                params.push(employee);
        
                const managerSql = `SELECT * FROM employee`;
    
                connection.query(managerSql, (err, data) => {
                if (err) throw err; 
    
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                
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
                    
                    let employee = params[0]
                    params[0] = manager
                    params[1] = employee 
                

                    // console.log(params)

                    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated!");
                        
                        showEmployees();
                    });
                });
            });
        });
    });
};

// delete an employee
deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) =>{
        if (err) throw err;

        const employees = data.map (({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Which employee would you like to delete?',
                    choices: employees
                }
            ]).then(employeeChoice => {
                const employee = employeeChoice.name;

                const sql = `DELETE FROM employee WHERE id = ?`;

                connection.query(sql, employee, (err, res) => {
                    if (err) throw err;
                    console.log('Successfull deleted employee!');

                    showEmployees();
                });
            });
    });
};

// delete department
deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`; 
  
    connection.query(deptSql, (err, data) => {
        if (err) throw err; 
  
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
        inquirer.prompt([
            {
                type: 'list', 
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
        .then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;
  
            connection.query(sql, dept, (err, result) => {
                if (err) throw err;
                console.log("Successfully deleted!"); 
  
                showDepartments();
            });
        });
    });
};

// delete role
deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.query(roleSql, (err, data ) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to delete?',
                choices: role
            }
        ]).then(roleChoice => {
            const role = roleChoice.role;
            const sql = `DELETE FROM role WHERE id = ?`;

            connection.query(sql, role, (err, res) => {
                if (err) throw err;
                console.log('Successfully deleted role!');

                showRoles();
            });
        });
    });
};

exitApp = () => {
    connection.end();
};

userPrompts();