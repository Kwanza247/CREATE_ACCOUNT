const jwt = require('jsonwebtoken');  

const decodeJwtUser = async (token) => {
    try {
        const payload = token.split(".")

        const payloadValue = payload[1];

        const decodedBody = atob(payloadValue);

        const parsedBody = JSON.parse(decodedBody);
        // console.log("parsedBody: ", parsedBody)
        return parsedBody;
    }catch (error) {
        console.error("Error decoding JWT token: ", error);
    }
}

const authMiddlewareInterceptor = async (req, res, next) => {
    try{
        console.log("req.headers: ", req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided", statusCode: 401 });
        }
        const token = authHeader.split(" ")[1];
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("comparism: ", {
            user: await decodeJwtUser(token),
            verifiedToken,
        });
        const decodedUser = await decodeJwtUser(token);
        if (decodedUser.email !== verifiedToken.email) {
            return res.status(401).json({ message: "Unauthorized: Invalid token", statusCode: 401 });
        }
        req.user = decodedUser; 
        next();
    }catch (error) {
        return next(res.status(401).json({ message: "Unauthorized: Invalid token" }));
    }
}
module.exports = {decodeJwtUser, authMiddlewareInterceptor};
