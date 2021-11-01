const express = require('express');
const router =express.router();
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

