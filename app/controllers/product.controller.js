const Product = require('../models/product.model.js');
let productData = require('../data/products.json');
const { name } = require('pug/lib/index.js');

//Placeholder product if none are found
const notFoundProduct = new Product({
    id: -1,
    name: "Product Not Found",
    price: 0,
    dimensions: {x: 0, y: 0, z: 0},
    stock: 0,
    reviews: []
});

//TODO
exports.findByName = (req, res) => {
    console.log("finding the propducts");
    console.log(req.query.name);
    

    if (req.query.inStock == 0){
        Product.find()
        .where("name").regex(new RegExp(".*" + req.query.name + ".*"))
        .exec(function(err, results){
            if (err){
 			res.status(500).send("Error reading products.");
 			console.log(err);
 			return;
            }
            console.log(results);
            res.render("pages/products", {products: results});
        })
    } else {
        products = Product.find()
        .where("name").regex(new RegExp(".*" + req.query.name + ".*"))
        .where("stock").gte(1)
        .exec(function(err, results){
            if (err){
                res.status(500).send("Error reading products.");
                console.log(err);
                return;
               }
               console.log(results);
               res.render("pages/products", {products: results});
        })
    }
}

exports.findById = (req, res) => {
    Product.find()
    .where("id").eq(req.params.id).exec(function(err, results){
        if (err){
         res.status(500).send("Error reading products.");
         console.log(err);
         return;
        }
        console.log(results);
        if(req.headers.accept.includes("text/html")){
            res.render("pages/product", {product: results[0]}); 
        }else if(req.headers.accept.includes("text/JSON")){
            res.send(results[0]);
            return; 
        } 
    });
}

exports.getReviewsById = (req, res) => {
    console.log(req.params.id);

    Product.find()
    .where("id").eq(req.params.id).exec(function(err, results){
        if (err){
         res.status(500).send("Error reading products.");
         console.log(err);
         return;
        }
        console.log(results);
        if(req.headers.accept.includes("text/html")){
            res.render("pages/reviews", {reviews: results[0].reviews}); 
        }else if(req.headers.accept.includes("text/JSON")){
            res.send(results[0].reviews);
            return; 
        } 
    });
}

//Generate all of the products initially stored in the database
exports.generateProducts = (req, res) =>{
    Product.find()
    .where("id").eq(0).exec(function(err, results){
        if (err){
         res.status(500).send("Error reading products.");
         console.log(err);
         return;
        }else if(results.length == 0){
            for(let i = 0; i < productData.length; i++){
                let id = productData[i].id
                let name = productData[i].name;
                let price = productData[i].price;
                let x = productData[i].dimensions.x;
                let y = productData[i].dimensions.y;
                let z = productData[i].dimensions.z;
                let dimensions = {"x": x, "y": y, "z": z}
                let stock = productData[i].stock
                let product = new Product({
                    id: id,
                    name: name,
                    price: price,
                    dimensions: dimensions,
                    stock: stock,
                    reviews: []
                    //Ratings: req.body[i].Ratings
                });
                product.save()
                .catch(err =>{
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Product."
                    });
                });
            }
        }
    });
}

//Creates a movie with the given parameters
exports.create = (req, res) => {
    // Create the product
    let id = req.body.id
    let name = req.body.name
    let price = req.body.price
    let x = req.body.dimensions.x
    let y = req.body.dimensions.y
    let z = req.body.dimensions.z
    let dimensions = {x: x, y: y, z: z}
    let stock = req.body.stock

    const product = new Product({
        id: id,
        name: name,
        price: price,
        dimensions: dimensions,
        stock: stock
    });

    product.save()
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while generating the product."
        });
    });
    
    // Save product in the database
    res.send(product);
};




//Adding a review to the database using the given parameters
exports.addReview = (req, res) => {
    console.log(req.body)
    let id = req.params.id
    Product.findOne()
    .where("id").eq(id).exec(function(err, product){
        if (err){
            res.status(500).send("Error reading products.");
            console.log(err);
            return;
        }

        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + id
            });            
        }
        console.log(product)
        product.reviews.push(req.body.rating);
        product.save()
        res.status(201).send("Successfully added the review")
    });
};


// Returning all of the movies in the databse
exports.findAll = (req, res) => {
    Movie.find()
    .then(movies => {

        res.render("pages/index");
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving movies."
        });
    });
};

