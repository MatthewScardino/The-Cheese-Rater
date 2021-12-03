module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Used to get list of Brands for the dropdown when adding a new Product*/

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

    /*Retreives all Products. Uses brand_ID to display brand_name*/

    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT product_ID, product_name, type, Brands.brand_name, description FROM Products INNER JOIN Brands ON Brands.brand_ID = Products.brand_ID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }

    /*Filter function - Display all products of a given type.*/

    function getProductsByBrand(req, res, mysql, context, complete){
        var query = "SELECT product_name, type, Brands.brand_name, description FROM Products INNER JOIN Brands ON Brands.brand_ID = Products.brand_ID WHERE Products.brand_ID = ?";
        console.log(req.params)
        var inserts = [req.params.brand_ID]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.products = results;
              complete();
          });
      }

    /*Filter function - Display all products of a given type.*/

    function getProductsByType(req, res, mysql, context, complete){
        var query = "SELECT product_name, type, Brands.brand_name, description FROM Products INNER JOIN Brands ON Brands.brand_ID = Products.brand_ID WHERE type = ?";
        console.log(req.params)
        var inserts = [req.params.type]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.products = results;
              complete();
          });
      }

    /* Find procucts name that starts with a given string */
    
    function getProductsWithNameLike(req, res, mysql, context, complete) {
          var query = "SELECT product_name, type, Brands.brand_name, description FROM Products INNER JOIN Brands ON Brands.brand_ID = Products.brand_ID WHERE Products.product_name LIKE " + mysql.pool.escape(req.params.s + '%');
          console.log(query)
  
          mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.products = results;
              complete();
          });
      }

    /*Display all products*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteproducts.js","filterproducts.js","searchproducts.js"];
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }
        }
    });

    /*Display all products from a given brand or type*/

    router.get('/filter/brand/:brand_ID', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterproducts.js", "deleteproducts.js", "searchproducts.js"];
        var mysql = req.app.get('mysql');
        getProductsByBrand(req,res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }
        }
    });

        /*Display all products from a given brand or type*/

    router.get('/filter/type/:type', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterproducts.js", "deleteproducts.js", "searchproducts.js"];
        var mysql = req.app.get('mysql');
        getProductsByType(req,res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }
        }
    });

    /*Add a Product*/

    router.post('/', function(req, res){
        console.log(req.body.brand)
        console.log(req.body); //for debugging purposes
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Products (product_name, brand_ID, type, description) VALUES (?,?,?,?)";
        var inserts = [req.body.product_name, req.body.brand_ID, req.body.type, req.body.description];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields) {
            if(error){
                console.log(JSON.stringify(error));
                if (error.errno == 1062){    //if there's a duplicate error
                    console.log("Duplicate error.");
                    res.render('duplicate');
                } else {  
                res.write(JSON.stringify(error));
                res.end();}
            }else{
                res.redirect('/products');
            }
        });
    });

    /*Display all products name that starts with a given string.*/

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterproducts.js","searchproducts.js"];
        var mysql = req.app.get('mysql');
        getProductsWithNameLike(req, res, mysql, context, complete);
        getBrands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }
        }
    });

    /* Route to delete a prodcut, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:product_ID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Products WHERE product_ID = ?";
        var inserts = [req.params.product_ID];
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
