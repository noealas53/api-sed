const jwt = require("jsonwebtoken")

// 
exports.signToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    return token;
}

exports.signTokenForRecovery = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_RECOVERY_SECRET, { expiresIn: '5m' });

    return token
}

exports.verifyTokenForRecovery = (token) => {
    return jwt.verify(token, process.env.JWT_RECOVERY_SECRET);
}