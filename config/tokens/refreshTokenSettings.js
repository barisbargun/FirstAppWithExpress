const jwt = require('jsonwebtoken');

const refreshTokenSettings = (username) => {
    return jwt.sign(
        { "username": username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '25m' } // 1 day
    )
};

module.exports = refreshTokenSettings;