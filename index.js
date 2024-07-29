require("dotenv").config({ path: "./.env" });
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());

mongoose.connect(process.env.DB_URI, {});

app.post("/api/user", async (req, res) => {
	const { username, email, dob } = req.body;

	if (!username || !email || !dob) {
		return res.status(400).json({
			success: false,
			message: "Please provide all the required fields",
		});
	}

	// Check if the email already exists in the database
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({
			success: false,
			message: "Email already exists",
		});
	}

	// Create a new user document
	try {
		const newUser = new User({ username, email, dob: new Date(dob) });
		await newUser.save();

		return res.status(201).json({
			success: true,
			data: newUser,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "An error occured while trying to create user.",
		});
	}
});

app.get("/api/users", async (req, res) => {
	const users = await User.find();
	return res.status(200).json({ success: true, data: users });
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
	console.log("Server listening on PORT", PORT);
});
