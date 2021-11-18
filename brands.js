module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Retrieve all Brands from database*/

    function getBrands(res, mysql, context, complete){
        mysql.pool.query("SELECT brand_ID, brand_name, country_of_origin, website FROM Brands", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.brands = results;
            complete();
        });
    }

    /*Display all Brands*/

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getBrands(res, mysql, context, complete);
        function complete(){
                res.render('brands', context);
            }
    });

    /*Add a Brand*/

    router.post('/', function(req, res){
        console.log(req.body); //for debugging purposes
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Brands (brand_name, country_of_origin, website) VALUES (?,?,?)";
        var inserts = [req.body.brand_name, req.body.country_of_origin, req.body.website];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/brands');
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:brand_ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Brands WHERE brand_ID = ?";
        var inserts = [req.params.id];
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
