const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
const counter = mongoose.model('counter', CounterSchema);


const OrderSchema = mongoose.Schema({
    name: String,
    id: Number,
    products: [{id: Number, quantity: Number}],
}, {
    timestamps: true
});

OrderSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count) {
        console.log("...count: "+JSON.stringify(count));
        doc.id = count.seq;
        next();
    })
    .catch(function(error) {
        console.error("counter error-> : "+error);
        throw error;
    });
});

module.exports = mongoose.model('Order', OrderSchema);