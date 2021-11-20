module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Retrieve all Users from database*/

    function getUsers(res, mysql, context, complete){
        mysql.pool.query("SELECT user_ID, fname, lname, email, password FROM Users", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.users = results;
            complete();
        });
    }

    /*Display all Users*/

    router.get('/', function(req, res){
        var context = {};
        context.jsscripts = ["deleteuser.js"];
        var mysql = req.app.get('mysql');
        getUsers(res, mysql, context, complete);
        function complete(){
                res.render('users', context);
            }
    });

    /*Add a User*/

    router.post('/', function(req, res){
        console.log(req.body); //for debugging purposes
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Users (fname, lname, email, password) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.email, req.body.password];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/users');
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:user_ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Users WHERE user_ID = ?";
        var inserts = [req.params.user_ID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
