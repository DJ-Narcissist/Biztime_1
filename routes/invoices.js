const express = require('express');
const db = require('./db');
const { ExpressError } = require('./expressError');

const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    return next(new ExpressError('Not Found', 404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
        error: err.message,
    });
});

app.get('/invoices', async (req, res, next) => {
    try {
        const result = await db.query('SELECT id, comp_code FROM invoices');
        const invoices = result.rows;
        res.json({ invoices });
    } catch (err) {
        return next(err);
    }
});

app.post('/invoices', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const query = 'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *';
        const values = [comp_code, amt];
        const result = await db.query(query, values);
        const newInvoice = result.rows[0];
        return res.json({ invoice: newInvoice });
    } catch (err) {
        return next(err);
    }
});

app.put('/invoices/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { amt } = req.body;
        const query = 'UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *';
        const values = [amt, id];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const updatedInvoice = result.rows[0];
        return res.json({ invoice: updatedInvoice });
    } catch (err) {
        return next(err);
    }
});

app.delete('/invoices/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const query = 'DELETE FROM invoices WHERE id=$1';
        const result = await db.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        return res.json({ status: 'deleted' });
    } catch (err) {
        return next(err);
    }
});

module.exports = app;

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});