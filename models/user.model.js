const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	email: String,
	username: String,
	dob: Date,
});

module.exports = mongoose.model("User", userSchema);
