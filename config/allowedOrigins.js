// izin verilen kökenler yani websitelerinin fetch get, set vb GRUD
// operasyonlarını yapmasını sağlar.

const allowedOrigins = [
    "https://www.google.com.tr", 
    'http://localhost:3500'
];

module.exports = allowedOrigins;