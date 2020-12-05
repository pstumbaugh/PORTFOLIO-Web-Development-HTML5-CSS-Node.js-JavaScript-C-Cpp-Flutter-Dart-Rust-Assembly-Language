var mysql = require('mysql');
var credentials = require('./credentials.js');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : credentials.myUsername,
  password        : credentials.myPassword,
  database        : credentials.myUsername
});

module.exports.pool = pool;
