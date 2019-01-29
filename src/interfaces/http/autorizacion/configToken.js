module.exports = {
	signOptions : {
		expiresIn:  "12h",
		algorithm:  "RS256"
	},

	verifyOptions : {
		expiresIn:  "12h",
		algorithm:  ["RS256"]
	},

	forgotOptions: {
		expiresIn:  "24h",
		algorithm:  "HS256"
	},
};