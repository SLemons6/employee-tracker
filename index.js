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
    db.findEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.table(employees);
    })
    .then(() => startingPrompt());
    }

// Display employees by department
function showByDepartment() {
    db.viewDepartments()
    .then(([rows]) => {
        let departments = rows;
        const dChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));
        
        inquirer.prompt([
            {
                type: "list",
                name: "deptId",
                message: "Which department's employees do you wish to see?",
                choices: dChoices
            }
        ])
            .then(res => db.findByDepartment(res.deptId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                console.table(employees);
            })
            .then(() => startingPrompt())
    });
} 

// Display employees by manager
function showByManager() {
    db.findEmployees() 
    .then(([rows]) => {
        let managers = rows;
        const mChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                type: "list",
                name: "mId",
                message: "Which manager's employees do you wish to see?",
                choices: mChoices
            }
        ])
        .then(res => db.findByManager(res.mId))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            if (employees.length === 0) {
                console.log("This manager has no employees");
            } else {
                console.table(employees);
            }
        })
        .then(() => startingPrompt())
    });
}

// Create an employee
function newEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            message: "What is the new employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the new employee's last name?"
        }
    ])
    .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.viewAllRoles() 
        .then(([rows]) => {
            let roles = rows;
            const rChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            inquiere.prompt({
                type: "list",
                name: "rId",
                message: "What is the new employee's role?",
                choices: rChoices
            })
            .then(res => {
                let roleId = res.rId;

                db.findEmployees() 
                .then(([rows]) => {
                    let employees = rows;
                    const mChoices = employees.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    mChoices.unshift({ name: "None", value: null });

                    inquirer.prompt({ 
                        type: "list",
                        name: "mId",
                        message: "Who is the new employee's manager?",
                        choices: mChoices
                    })
                    .then(res => {
                        let employee = {
                            manager_id: res.mId,
                            role_id: res.rId,
                            first_name : firstName,
                            last_name : lastName
                        }
                        
                        db.addEmployee(employee);
                    })
                    .then(() => console.log(
                        `Added ${firstName} ${lastName} to the employee database`
                    ))
                    .then(() => startingPrompt())
                })
            })
        })
    })
}

// 



                        // start().catch((err) => {
                            //     console.error(err);
                            // });
start();