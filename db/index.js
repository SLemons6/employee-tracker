const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    // Find all employees, and join with roles/departments
    findEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    }
    // Find all employees by their department
    findByDepartment(departmentId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
            departmentId
        );
    }
    // Find employees by their manager
    findByManager(managerId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
            managerId
        );
    }
    // Add a new employee
    addEmployee(employee) {
        return this.connection.promise().query(
            "INSERT INTO employee SET ?",
            employee
        );
    }
    // Remove an employee
    removeEmployee(employeeId) {
        return this.connection.promise().query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        );
    }
    // Update role for an employee
    updateRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        );
    }
    // Update employee's manager
    updateManager(employeeId, managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [managerId, employeeId]
        );
    }
    // View all roles, along with their departments
    viewAllRoles() {
        return this.connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }
    // Add a role 
    addRole(role) {
        return this.connection.promise().query(
            "INSERT INTO role SET ?",
            role
        );
    }
    // Remove a role 
    removeRole(roleId) {
        return this.connection.promise().query(
            "DELETE FROM role WHERE id = ?",
            roleId
        );
    }
    // View all departments
    viewDepartments() {
        return  this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }
    // Add a department 
    addDepartment(department) {
        return this.connection.promise().query(
            "INSERT INTO department SET ?",
            department
        );
    }
    // Remove a department
    removeDepartment(departmentId) {
        return this.connection.promise().query(
            "DELETE FROM department WHERE id = ?",
            departmentId
        );
    }
    // View budget by department
    viewBudget() {
        return this.connection.promise().query(
            "SELECT department.id, department.name, SUM(role.salary) AS total_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"            
        );
    }
} 

module.exports = new DB(connection);
