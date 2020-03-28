module.exports = {
    "secret": "phaseSecureMyAPI",
    "database": process.env.MONGODB_URI ? process.env.MONGODB_URI : "mongodb://localhost:27017/myapiDBAN",
};