const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyToken = (req, res, next) => {
	try {
		const auth = req.headers.authorization;
		const token = auth.split(' ')[1];
		req.verifiedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
		next();
	} catch(error) {
		res.status(401).json({message: 'Authorization failed'});
	}

};

module.exports = verifyToken;
