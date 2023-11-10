// dbConnection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");

const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')


// trying to set token on register


async function register(req, res) {
	const { username, firstname, lastname, email, password } = req.body;

	if (!username || !firstname || !lastname || !email || !password) {
		return res.status(400).json({ msg: "Please provide all the information" });
	}

	try {
		const [existingUser] = await dbConnection.query(
			"SELECT username FROM users WHERE username = ? OR email = ?",
			[username, email]
		);

		if (existingUser.length > 0) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: "User already exists" });
		}

		if (password.length < 8) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ msg: "Password must be at least 8 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		await dbConnection.query(
			"INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
			[username, firstname, lastname, email, hashedPassword]
		);

		// Retrieve the userid after user registration
		const [user] = await dbConnection.query(
			"SELECT userid FROM users WHERE username = ?",
			[username]
		);

		if (user.length === 0) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ msg: "User creation failed" });
		}

		const userid = user[0].userid;
		const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" });

		return res.status(StatusCodes.CREATED).json({ msg: "User created", token, username });
	} catch (error) {
		console.log(error);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "Something went wrong" });
	}
}






// login part
async function login(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all  required fields"})
	}
	try {
const [user]= await dbConnection.query("select username,userid,password from users where email = ?", [email])
		//   return res.json({user:user})
		if (user.length == 0) {
			return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid"})
		}

		// compare password
		const isMatch = await bcrypt.compare(password, user[0].password);
		if (!isMatch) {
			return res.status(StatusCodes.BAD_REQUEST).json({msg:"invalid credential"})
		}
		const username = user[0].username;
		const userid = user[0].userid;
	const token=jwt.sign({username, userid}, "secret", {expiresIn: "1d"})
return res.status(StatusCodes.OK).json({msg:"user login successful", token, username})
	} catch (error) {
		console.log(error.message);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "something went wrong" });
	}
}

async function checkUser(req, res) {
	const username = req.user.username
	const userid= req.user.userid
	return res.status(StatusCodes.OK).json({msg: "valid user", username, userid})
	// res.send("check");
}

module.exports = { register, login, checkUser };
