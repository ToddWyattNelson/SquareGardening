const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gardenSchema = new Schema({
    title:{
        type: String,
        require: true
    },

    length: {
        type: Number,
        required: true
    },

    width: {
        type: Number,
        required: true
    },

    size: {
        type: [Schema.Types.Mixed]
    }


    // not working
    // size:{
    //     type: [[this.height],[this.length]],
    //     default: undefined
    // }

});






module.exports = mongoose.model('Garden', gardenSchema);
