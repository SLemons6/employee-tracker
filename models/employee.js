const createConnection = require('../../db/connection');

class Employee {
    get() {
        const sql = `SELECT employees.*, roles.name AS role_name, departments.name AS department_name, 
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments 
                ON employees.department_id = departments.id`;

        return Promise.resolve(createConnection).then((db) => {
            db.query(sql, (err, rows) => {
                if (err) {
                    return Promise.reject({ error: err.message });
                }
                return Promise.resolve({
                    message: 'query successful',
                    data: rows
                });
            });
        });
    }
}

