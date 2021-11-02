const createConnection = require('../db/connection');

class Employee {
    static get() {
        const sql = `SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employees e
                INNER JOIN roles
                ON e.role_id = roles.id
                INNER JOIN departments 
                ON roles.department_id = departments.id
                LEFT JOIN employees m
                ON e.manager_id = m.id`
                ;

        return createConnection().then((db) => {
            return db.query(sql).finally(() => {
                db.end();
            });
        });
    }
}

module.exports = Employee;