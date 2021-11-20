module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Retreives all Pairings. Uses brand_ID to display brand_name*/

    function getPairings(res, mysql, context, complete){
        mysql.pool.query("SELECT pairing_ID, pairing_name, Brands.brand_name FROM Pairings INNER JOIN Brands ON Brands.brand_ID = Pairings.brand_ID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pairings = results;
            complete();
        });
    }

    /*Used to get list of Brands for the dropdown when adding a new Pairing*/

    function getBrands(res, mysql, context, complete){
        mysql.pool.query("SELECT brand_ID, brand_name FROM Brands", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.brands = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletepairings.js"]
        var mysql = req.app.get('mysql');
        getPairings(res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pairings', context);
            }

        }
    });

    /*Add a Pairing*/

    router.post('/', function(req, res){
        console.log(req.body); //for debugging purposes
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Pairings (pairing_name, brand_ID) VALUES (?,?)";
        var inserts = [req.body.pairing_name, req.body.brand_ID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pairings');
            }
        });
    });

    /* Route to delete a prodcut, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:pairing_ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Pairings WHERE pairing_ID = ?";
        var inserts = [req.params.pairing_ID];
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
