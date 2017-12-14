var mongoose = require('mongoose');

module.exports = mongoose.model('StateOrder', {
    state: {
        type: Number,
        default: 0
    },
    orderIds: {
        type: [String],
        default: []
    }
});
