const db = require('../../db/connection');
const validateInput = require('../../utils/validateInput');

// get all roles and their affiliated departments
router.get('/roles', (req, res) => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department_name
                    FROM roles
                    INNER JOIN departments
                    ON roles.department_id= departments.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'query successful',
            data: rows
        });
    });
});

// create a role
router.post('/role', ({ body }, res) => {
    const errors = validateInput(body, 'title', 'salary', 'department');
    if (errors) {
        res.status(400).json({ error: err.message });
        return;
    }

    const sql = `INSERT INTO roles (title, salary, department) VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'role added',
            data: body
        });
    });
});

// delete a role
router.delete('/role/:id', (req, res) => {
    const sql = `DELETE FROM roles WHERE id= ?`;

    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({ 
                message: 'Role not found'
            });
        } else {
            res.json({ 
                message: 'role deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});