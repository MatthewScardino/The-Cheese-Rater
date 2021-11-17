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

    return router;
}();
