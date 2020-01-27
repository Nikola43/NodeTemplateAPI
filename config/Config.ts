require('dotenv').config();

export default {
    jwtSecret: process.env.JWT_TOKEN_KEY || "signis",
};
