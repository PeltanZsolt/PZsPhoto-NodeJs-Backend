const express = require('express');
const router = express.Router();
const xss = require("xss");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passwordValidator = require("../utils/password.validator");
const db = require("../utils/database");
const existingUserMiddleware = require('../utils/existing-user.middleware')

const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.post("/signup", existingUserMiddleware, async (req, res) => {
    if (req.existingUser) {
		return res.json({ message: "Username already exists." });
    }
	const newUser = {
		username: xss(req.body.username),
		password: xss(req.body.password),
		passwordVerify: xss(req.body.passwordVerify),
	};

	if (!passwordValidator(newUser.password)) {
		return res.json({ message: "Weak password" });
	}

	if (newUser.password !== newUser.passwordVerify) {
		return res.json({ message: `Passwords doesn't match` });
	}

	const jwtToken = jwt.sign({ username: newUser.username }, jwtSecretKey);
	const signupData = [
		newUser.username,
		await bcrypt.hash(newUser.password, 12),
		jwtToken,
	];

	try {
		await db.query(
			`INSERT INTO users (username, password, jwtToken) VALUES (?)`,
			[signupData]
		);
	} catch (error) {
		console.log("Database error: ", error.message);
		return res.status(500).send(error);
	}

	res.status(200).json({
		message: "Signup successful!",
		jwtToken: jwtToken,
		isAdmin: false,
	});
});

router.post("/login", existingUserMiddleware, async (req, res) => {
    if (!req.existingUser) {
        return res.send({ message: "Invalid username." });
    }

	if (!(await bcrypt.compare(req.body.password, req.existingUser.password))) {
		return res.json({
			message: "Incorrect password",
		});
	}
    
	res.json({
		message: "Login successful",
		jwtToken: req.existingUser.jwtToken,
		isAdmin: req.existingUser.isAdmin,
	});
});

module.exports = router;