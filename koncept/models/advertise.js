const mongoose = require('mongoose');

// Advertisement schema
const AdvertisementSchema = mongoose.Schema({
   city:{
       type: String,
       required: true
   },
    category:{
       type: String,
        required:true
    },
    description:{
       type: String,
        required: true
    },
    userId:{
       type: String,
        required: true
    },
    images:[String]
});

const Advertisement = module.exports = mongoose.model('Advertisement', AdvertisementSchema);