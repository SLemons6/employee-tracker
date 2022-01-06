require('dotenv').config();
const inquirer = require('inquirer');
const Employee = require('./models/Employee');
require('console.table');

function startingPrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action.',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_ALL_EMPLOYEES'
                },
                {
                    name: 'View All Empoyees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View All Employees By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER',
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View Total Utilized Budget By Department",
                    value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
                },

            ]
        }
    ])
}

async function start() {
    const { action } = await startingPrompt();


    switch (action) {
        case 'view all employees':
            const [rows, _] = await Employee.get();
            console.table(rows);
            break;
        default: console.log('');
    }
}

// start().catch((err) => {
//     console.error(err);
// });

start();