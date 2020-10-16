const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    discordId:{
        type: String,
        required: true,
        unique: true
    },
    discordTag:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    guilds:{
        type: Array,
        required: true,
        default: []
    }
}, { collection: 'UserData' } )

module.exports = mongoose.model('UserData', UserSchema)