var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_scardinm',
  password        : 'Reef1234!',
  database        : 'cs340_scardinm'
});
module.exports.pool = pool;
