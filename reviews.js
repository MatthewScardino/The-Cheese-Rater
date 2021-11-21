module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Retreives all Reviews. Uses user_ID and product_ID to get user name and product name*/

    function getReviews(res, mysql, context, complete){
        mysql.pool.query("SELECT review_ID, Users.fname, Users.lname, Products.product_name, rating, comment FROM Reviews INNER JOIN Users ON Users.user_ID = Reviews.user_ID INNER JOIN Products ON Products.product_ID = Reviews.product_ID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.reviews = results;
            complete();
        });
    }

    /*Used to get list of Users for the dropdown when adding a new Review*/

    function getUsers(res, mysql, context, complete){
        mysql.pool.query("SELECT user_ID, fname, lname FROM Users", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.users = results;
            complete();
        });
    }

    /*Used to get list of Products for the dropdown when adding a new Review*/

    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT product_ID, product_name FROM Products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }

    function getReview(res, mysql, context, review_ID, complete){
        var sql = "SELECT review_ID, Reviews.user_ID, Reviews.product_ID, Users.fname, Users.lname, Products.product_name, rating, comment FROM Reviews INNER JOIN Users ON Users.user_ID = Reviews.user_ID INNER JOIN Products ON Products.product_ID = Reviews.product_ID WHERE review_ID =?";
        var inserts = [review_ID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.review = results[0];
            complete();
        });
    }

    /* Display one Review for the specific purpose of updating the review */

    router.get('/:review_ID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedproduct.js", "selecteduser.js", "updatereview.js"];
        var mysql = req.app.get('mysql');
        getReview(res, mysql, context, req.params.review_ID, complete);
        getUsers(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        getReviews(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('update-review', context);
            }
        }
    });

    /* The URI that update data is sent to in order to update a review */

    router.put('/:review_ID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.review_ID)
        var sql = "UPDATE Reviews SET user_ID=?, product_ID=?, rating=?, comment=? WHERE review_ID=?";
        var inserts = [req.body.user_ID, req.body.product_ID, req.body.rating, req.body.comment, req.params.review_ID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /*Displays all Reviews with user names and product names*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletereview.js"];
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        getUsers(res, mysql, context, complete);
        getReviews(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('reviews', context);
            }
        }
    });

    /*Add a Review*/

    router.post('/', function(req, res){
        console.log(req.body); //for debugging purposes
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Reviews (user_ID, product_ID, rating, comment) VALUES (?,?,?,?)";
        var inserts = [req.body.user_ID, req.body.product_ID, req.body.rating, req.body.comment];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/reviews');
            }
        });
    });

    /* Route to delete a person, returns a 202 upon success. */

    router.delete('/:review_ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Reviews WHERE review_ID = ?";
        var inserts = [req.params.review_ID];
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
