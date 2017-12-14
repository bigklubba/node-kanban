var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
    text: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        default: ''
    },
    state: {
      type: Number,
      default: 0
    }
});
