const express =  require('express');
const db = require('./db');
const { ExpressError } =require('./expressError');

const app = express();


app.use(function(req, res, next){
    return new (ExpressError("Not Found", 404));
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

app.get('/companies', async (req,res, next) => {
    try {
        const result = await db.query('SELECT code, name FROM companies');
        const companies = result.rows;
        res.json({ companies });
    } catch (err) {
        return next(err);
    }
});

app.post('/companies', async (req,res, next) => {
   try {
    const { code, name, description } = req.body;
    const query = 'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *';
    const values = [code, name, description];
    const result = await db.query(query, values);
    const newCompany = result.rows[0];
    return res.json({ company: newCompany });
   } catch (err) {
    return next(err);
   }
});

app.put('/copmanies/:code', async (req, res) => {
   try {
    const code = req.params.code;
    const {name, description} = req.body;
    const findCompanyQuery = 'SELECT * FROM companies WHERE code = $1';
    const findCompanyValues = [code];
    const result = await db.query(findCompanyQuery, findCompanyValues);
    if (result.rows.length === 0) { 
        return res.status(404).json({ error : 'Company not found'});
    }

    const updateQuery = 'UPDATE companies SET name $1, description = $2 WHERE code= $3 RETURNING *';
    const updateValues = [name, description, code];
    const updateResult = await db.query(updateQuery, updateValues);
    const updateComnpany = updateResult.rows[0];

    return res.json({ company : updatedCompany})
   } catch (err){ 
    return next(err);
   }

});

app.delete('/companies/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const findCompanyQuery = 'SELECT * FROM companies WHERE code = $1';
        const findCompanyValues = [code];
        const result = await db.query(findCompanyQuery, findCompanyValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found'});
        }

        const deleteQuery = 'DELETE companies SET name = $1, description = $2, WHERE code = $3 RETURNING *';
        await db.query(deleteQuery, findCompanyValues);

        return res.json({ status: 'deleted' });
    }   catch(err){ 
        return next(err);
    }
});

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});