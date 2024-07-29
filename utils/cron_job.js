require("dotenv").config({ path: "./.env" });
const cron = require("node-cron");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const sendEmails = require("./send_mail");

mongoose.connect(process.env.DB_URI, {});

cron.schedule("0 7 * * *", async () => {
	const getTodayBirthdays = async () => {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const endOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + 1
		);

		const users = await userModel.find({
			dob: {
				$gte: startOfDay,
				$lt: endOfDay,
			},
		});

		return users;
	};

	const users = await getTodayBirthdays();

	if (users) {
		sendEmails(users);
	}
	return;
});
