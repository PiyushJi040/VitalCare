import User, {
	Doctor,
	HealthAssistant,
	PharmacyManager,
} from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// ------------------ SIGNUP ------------------
export const signupUser = async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			location,
			role,
			specialisation,
			qualification,
			storeName,
		} = req.body;

		if (!name || !email || !password || !role) {
			return res
				.status(400)
				.json({ message: "Name, email, password, and role are required" });
		}

		// Check if user already exists with same email & role
		const existingUser = await User.findOne({ email, role });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email and role" });
		}

		// Create user based on role
		let newUser;
		if (role === "doctor") {
			newUser = new Doctor({
				name,
				email,
				password,
				location,
				role,
				specialisation,
				qualification,
			});
		} else if (role === "healthAssistant") {
			newUser = new HealthAssistant({ name, email, password, location, role });
		} else if (role === "pharmacyManager") {
			newUser = new PharmacyManager({
				name,
				email,
				password,
				location,
				role,
				storeName,
			});
		} else {
			return res.status(400).json({ message: "Invalid role" });
		}

		await newUser.save();

		const token = generateToken(newUser._id, newUser.role);

		res.status(201).json({
			message: "Signup successful",
			token,
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				location: newUser.location,
				specialisation: newUser.specialisation,
				qualification: newUser.qualification,
				storeName: newUser.storeName,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ------------------ LOGIN ------------------
export const loginUser = async (req, res) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password || !role) {
			return res
				.status(400)
				.json({ message: "Email, password, and role are required" });
		}

		// Find user first
		const user = await User.findOne({ email, role });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Demo login check - allow any email with demo password
		if (password === 'demoPass') {
			const token = generateToken(user._id, user.role);
			
			return res.status(200).json({
				message: "Demo login successful",
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					location: user.location,
					specialisation: user.specialisation,
					qualification: user.qualification
				}
			});
		}

		// Regular password validation
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = generateToken(user._id, user.role);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				location: user.location,
				specialisation: user.specialisation,
				qualification: user.qualification,
				storeName: user.storeName,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ------------------ LOGOUT ------------------
export const logoutUser = async (req, res) => {
	try {
		// With stateless JWT, logout is usually handled on the client by removing the token
		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
