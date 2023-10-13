/** Database setup for BizTime. */

const { Client } = require('pg');

const client = new Client ({
    user: 'your_user',
    host: ' localhost',
    database: 'biztime',
    password:' your_password',
    port: 5000,
});


client.connect();

module.exports = client;