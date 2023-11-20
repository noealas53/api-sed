const jwt = require("jsonwebtoken")

// 
exports.signToken = (payload) => {
    const token = jwt.sign(payload, "ESOBRAT", { expiresIn: '24h' });
    
    return token;
}

exports.signTokenForRecovery = (payload) => {
    const token = jwt.sign(payload, "ESOBRAT_RECOVERY", { expiresIn: '5m' });

    return token
}

exports.verifyTokenForRecovery = (token) => {
    return jwt.verify(token, "ESOBRAT_RECOVERY");
}