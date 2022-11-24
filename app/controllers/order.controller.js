const Product = require('../models/product.model.js');
const Order = require('../models/order.model.js');


async function create(req, res){
	let products = req.body.products
	if (req.body.name == null || req.body.name == ""){
		res.status(409).send("No name was specified.");
		return;
	}
	for(let i = 0; i < products.length; i++){
		let currProduct = await Product.findOne().where("id").eq(products[i].id)
		if(!currProduct){
			res.status(409).send("Product not found with id: " + products[i].id + ".");
			return;
		}
		if(currProduct.stock < products[i].quantity){
			res.status(409).send("Quantity exceeds product stock for product with id: " + products[i].id  + ".");
			return;
		}
	}

	for(let i = 0; i < products.length; i++){
		let currProduct = await Product.findOne().where("id").eq(products[i].id)
		console.log(currProduct)
		currProduct.stock = currProduct.stock - products[i].quantity
		console.log(currProduct)
		currProduct.save()
	}

	let name = req.body.name
	const order = new Order({
		name: req.body.name,
		products: products
	})
	order.save();

	res.status(201).send({
		message: "Order created successfully!"
	});
}

module.exports.create = create;

exports.viewAll = (req, res) => {
	Order.find().exec(function(err, results){
		if (err){
			res.status(500).send("Error reading orders.");
			console.log(err);
			return;
		}
		if(req.headers.accept.includes("text/html")){
            res.render("pages/orders", {orders: results}); 
        }else if(req.headers.accept.includes("text/JSON")){
            res.send(results);
            return; 
        } 
	});
}

exports.findById = (req, res) => {
	Order.findOne()
    .where("id").eq(req.params.id).exec(function(err, results){
        if (err){
         res.status(500).send("Error reading orders.");
         console.log(err);
         return;
        }
        if(req.headers.accept.includes("text/html")){
            res.render("pages/order", {order: results}); 
        }else if(req.headers.accept.includes("text/JSON")){
            res.send(results);
            return; 
        } 
    });
}