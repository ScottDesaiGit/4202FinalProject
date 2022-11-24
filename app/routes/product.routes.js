
module.exports = (app) => {
    const products = require('../controllers/product.controller.js');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
      

    //Everything to do with the products controller 
    
    app.get('/products', products.findByName);
    app.get('/products/:id', products.findById);
    app.get('/reviews/:id', products.getReviewsById)
    app.post('/reviews/:id', products.addReview)
    app.post('/products', products.create);
}