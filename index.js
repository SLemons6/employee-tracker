require("dotenv").config();
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const db = require("./db")
require("console.table");

start();

function startingPrompt() {
    inquirer.prompt([
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
    ]).then(res => {
        let action = res.choice;
        // switch actions based on user's choice
        switch (action) {
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
    )
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
                        console.log("This employee doesn't manage any employees");
                    } else {
                        console.table(employees);
                    }
                })
                .then(() => startingPrompt())
        });
}

// Create an employee to add to database
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

                    inquirer.prompt({
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
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
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

// Remove an employee from database
function deleteEmployee() {
    db.findEmployees()
        .then(([rows]) => {
            let employees = rows;
            const eChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "eId",
                    message: "Which employee do you want to delete from the database?",
                    choices: eChoices
                }
            ])
                .then(res => db.removeEmployee(res.eId))
                .then(() => console.log("Deleted employee from the database"))
                .then(() => startingPrompt())
        })
}

// Changes employee's role
function changeEmployeeRole() {
    db.findEmployees()
        .then(([rows]) => {
            let employees = rows;
            const eChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "eId",
                    message: "Which employee's role do you want to update?",
                    choices: eChoices
                }
            ])
                .then(res => {
                    let employeeId = res.eId;
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const rChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "rId",
                                    message: "What is the employee's new role?",
                                    choices: rChoices
                                }
                            ])
                                .then(res => db.updateRole(employeeId, res.rId))
                                .then(() => console.log("Changed the employee's role"))
                                .then(() => startingPrompt())
                        });
                });
        })
}

// Change an employee's manager
function changeEmployeeManager() {
    db.findEmployees()
        .then(([rows]) => {
            let employees = rows;
            const eChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "eId",
                    message: "Which employee's manager do you want to update?",
                    choices: eChoices
                }
            ])
                .then(res => {
                    let employeeId = res.eId
                    db.findAllPossibleManagers(employeeId)
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
                                    message:
                                        "Which employee do you want to set as manager for the selected employee?",
                                    choices: mChoices
                                }
                            ])
                                .then(res => db.updateManager(employeeId, res.mId))
                                .then(() => console.log("Updated the employee's manager."))
                                .then(() => startingPrompt())
                        })
                })
        })
}

// Display roles
function showRoles() {
    db.viewAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => startingPrompt());
}

// Create a role
function newRole() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            const dChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "What is the role's title?"
                },
                {
                    name: "salary",
                    message: "What is the role's salary?"
                },
                {
                    type: "list",
                    name: "dId",
                    message: "Which department does the role belong to?",
                    choices: dChoices
                }
            ])
                .then(role => {
                    db.addRole(role)
                        .then(() => console.log(`Created ${role.title}`))
                        .then(() => startingPrompt())
                })
        })
}

// Remove a role
function deleteRole() {
    db.viewAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const rChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "rId",
                    message:
                        "Which role do you want to delete? Be careful, all employees that have this role will also be removed.",
                    choices: rChoices
                }
            ])
                .then(res => db.removeRole(res.rId))
                .then(() => console.log("Removed role from the database"))
                .then(() => startingPrompt())
        })
}

// Display deparments
function showDepartments() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => startingPrompt());
}

// Create a department
function newDepartment() {
    inquiere.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let name = res;
            db.addDepartment(name)
                .then(() => console.log(`Added ${name.name} to the database`))
                .then(() => startingPrompt())
        })
}

// Delete a department
function deleteDepartment() {
    db.viewDepartments()
        .then(([rows]) => {
            let departments = rows;
            const dChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "dId",
                message:
                    "Which department do you want to delete? Be careful, this will also delete the roles and employees belonging to this department",
                choices: dChoices
            })
                .then(res => db.removeDepartment(res.dId))
                .then(() => console.log("Deleted department from the database"))
                .then(() => startingPrompt())
        })
}

// View all departments and budget
function showBudget() {
    db.viewBudget()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => startingPrompt());
}

// Finish changes to the database and quit app
function finish() {
    console.log("All done!");
    process.exit();
}


// start().catch((err) => {
//     console.error(err);
// });
start();