const jwt = require('jsonwebtoken');

const accessTokenSettings = (username, roles) => {
    return jwt.sign({
        "UserInfo": {
            "username": username,
            "roles": roles
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
};

module.exports = accessTokenSettings;