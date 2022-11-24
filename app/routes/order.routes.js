
module.exports = (app) => {
    const orders = require('../controllers/order.controller.js');

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
      

    //All orders related methods
    app.post('/orders', orders.create)
    app.get('/orders', orders.viewAll)
    app.get('/orders/:id', orders.findById)

}