const express = require('express');
const router = express.router();
const db = require('../../db/connection');

// get all departments 
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'query successful',

        });
    });
});

// add a department
router.post('/department', ({ body }, res) => {
    const errors = validateInput(
        body,
        'name'
    );
    if (errors) {
        res.status(400).json({ error: errors });
        return
    }

    const sql = `INSERT INTO departments (name) VALUES (?)`;

    db.query(sql, body.name, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'query successful',
            data: body
        });
    });
});

// delete a department
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;

    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                message: 'Department deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;