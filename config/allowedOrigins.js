// izin verilen kökenler yani websitelerinin fetch get, set vb GRUD
// operasyonlarını yapmasını sağlar.

const allowedOrigins = [
    "http://localhost:5173", 
    'http://localhost:3500'
];

module.exports = allowedOrigins;