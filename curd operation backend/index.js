
const express = require('express');
const {Client} = require('pg');
const app = express();
const cors = require('cors');


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const con = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '1234',
    database: 'curd_operation'
})

con.connect().then(() => {
    console.log('Connected to PostgreSQL database');
}).catch(err => {
    console.error('Connection error', err.stack);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res) => {
    const query = 'SELECT * FROM curd_operation_data';
    con.query(query, (err, result) => {
        if(err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(result.rows);
    })
})

app.post('/users', (req, res) => {
    const user = req.body;
    const query = 'INSERT INTO curd_operation_data (firstname, lastname, dob, mobile, address) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    con.query(query, [user.firstname, user.lastname, user.dob, user.mobile, user.address], (err, result) => {
        if(err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Database error' });
        }
        else{
            console.log('User added successfully');
            res.status(201).json(result);
        }
    })
    
})

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // const name = req.body.name;

    // console.log('Updating user with firstname:', oldfirstname);

    const user = [
        req.body.firstname,
        req.body.lastname,
        req.body.dob,
        req.body.mobile,
        req.body.address,
        id
    ];
    // console.log(user);

    const query = 'UPDATE curd_operation_data SET firstname = $1, lastname = $2, dob = $3, mobile = $4, address = $5 WHERE id = $6 RETURNING *';

    con.query(query, user, (err, result) => {
        if(err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Database error' });
        } else {
    console.log("Query executed successfully", result);
}
        if(result.rowCount === 0) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    })
})

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM curd_operation_data WHERE id = $1 RETURNING *';

    con.query(query, [id], (err, result) => {
        if(err) {
            console.error('Error executing query', err.stack);
            return res.status(500).json({ error: 'Database error' });
        }
        if(result.rowCount === 0) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
    })
})
