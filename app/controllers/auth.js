"use strict";

const jwt = require("jsonwebtoken");
const config = require("./../../config/config");

const valideToken = (req, res, next) => {
    var token = req.headers["access-token"];
    if (token) {
      	jwt.verify(token, config.secret, (err, decoded) =>{      
	        if (err) {
	         	return res.json({ message: `invalid token ${err.message}` });    
	        } else {
	        	req.decoded = decoded;    
	        	next();
	        }
	    });
    } else {
        res.send({
            message: "No token provided." 
        });

    }
};

module.exports = {
    authenticate,
    valideToken
};