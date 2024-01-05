const jwt = require('jsonwebtoken');

const accessTokenSettings = (username, roles) => {
    return jwt.sign({
        "UserInfo": {
            "username": username,
            "roles": roles
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5s' }
    )
};

module.exports = accessTokenSettings;