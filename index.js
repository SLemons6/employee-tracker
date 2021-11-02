require('dotenv').config();
const inquirer = require('inquirer');
const Employee = require('./models/Employee');
const cTable = require('console.table');

function startingPrompt() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action.',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role'
            ]
        }
    ])
}

async function start() {
    const { action } = await startingPrompt();
    

    switch (action) {
        case 'view all employees':
            const [rows, _]  = await Employee.get();
            console.table(rows);
            break;
        default: console.log('');
    }
}

// start().catch((err) => {
//     console.error(err);
// });

start();