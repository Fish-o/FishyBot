
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    
    command:{
        type: String,
        required: true,
    },
    args:{
        type: Array, 
        required: true,
        default:[]
    },
    responses: { 
        type: Array, 
        required: true,
        default:[]
    },
    senderId: { 
        type: String,
        required: true,
    },
    messageId:{
        type: String,
        required: true,
    },
    channelId:{
        type: String,
        required: true,
    },
    Timestamp:{
        type: Date,
        required: true
    }
});

const CommandModel = module.exports = mongoose.model('commandLog', MessageSchema);