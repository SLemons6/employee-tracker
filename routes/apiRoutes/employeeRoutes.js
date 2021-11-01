const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const validateInput = require('../../utils/validateInput');

// get all of the current employees, along with their role, department, and manager, if applicable
router.get('/employees', (req, res) => {
    const sql = `SELECT employees.*, roles.name AS role_name, departments.name AS department_name, 
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments 
                ON employees.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'query successful',
            data: 'rows'
        });
    });
});

//