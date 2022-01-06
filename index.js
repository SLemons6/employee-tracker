require("dotenv").config();
const inquirer = require("inquirer");
const db = require("./db")
require("console.table");

function startingPrompt() {
    return inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?.",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_ALL_EMPLOYEES"
                },
                {
                    name: "View All Empoyees By Department",
                    value: "VIEW_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_BY_MANAGER",
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_MANAGER"
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
                    name: "View Total Budget By Department",
                    value: "VIEW_BUDGET_BY_DEPARTMENT"
                },
                {
                    name: "Finish",
                    value: "FINISH"
                }
            ]
        }
    ])
}

// change function based on user"s choice
async function start() {
    const { choice } = await startingPrompt();

    switch (choice) {
        case "VIEW_ALL_EMPLOYEES":
            showEmployees();
            break;
        case "VIEW_BY_DEPARTMENT":
            showByDepartment();
            break;
        case "VIEW_BY_MANAGER":
            showByManager();
            break;
        case "ADD_EMPLOYEE":
            newEmployee();
            break;
        case "REMOVE_EMPLOYEE":
            deleteEmployee();
            break;
        case "UPDATE_EMPLOYEE_ROLE":
            changeEmployeeRole();
            break;
        case "UPDATE_EMPLOYEE_MANAGER":
            changeEmployeeManager();
            break;
        case "VIEW_ROLES":
            showRoles();
            break;
        case "ADD_ROLE":
            newRole();
            break;
        case "REMOVE_ROLE":
            deleteRole();
            break;
        case "VIEW_DEPARTMENTS":
            showDepartments();
            break;
        case "ADD_DEPARTMENT":
            newDepartment();
            break;
        case "REMOVE_DEPARTMENT":
            deleteDepartment();
            break;
        case "VIEW_BUDGET_BY_DEPARTMENT":
            showBudget();
            break;
        default:
            finish();
    }
}

// Display all employees
function showEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.table(employees);
    })
    .then(() => startingPrompt());
    }

// Display employees by department
function showByDepartment() {
    db.findByDepartment()
    .then(([rows]) => {
        let departments = rows;
        const dChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        
        inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department's employees do you wish to see?",
                choices: dChoices
            }
        ])
            .then(res => db.findByDepartment(res.departmentId))
            .then(([rows]) => {
                let employees = rows;
                console.table(employees);
            })
            .then(() => startingPrompt())
    });
} 




                        // start().catch((err) => {
                            //     console.error(err);
                            // });
start();