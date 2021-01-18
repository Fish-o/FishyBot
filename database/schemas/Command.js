const { Int32 } = require('mongodb');
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
        type: Int32,
        required: true,
    },
    messageId:{
        type: Int32,
        required: true,
    },
    channelId:{
        type: Int32,
        required: true,
    }
});

const CommandModel = module.exports = mongoose.model('commandLog', MessageSchema);