const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type:String,
        required: true
    },
    email: String,
    password: {
        type:String,
        required: true
    },
    roles: {
        User:{
            type:Number,
            default:2001
        },
        Editor:Number,
        Admin:Number
    },
    refreshToken: [String]
});
// 'User' yazılsa dahi 'users' adı altında schema oluşturacaktır.
// tanımlandığı anda yok ise boş bir database oluşturulacak.
module.exports = mongoose.model('User', userSchema);