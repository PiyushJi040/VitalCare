import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

// ------------------ AUTH MIDDLEWARE ------------------
export const protect = async (req, res, next) => {
	try {
		let token;

		// Expect token in Authorization header → "Bearer <token>"
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({ message: "Not authorized, token missing" });
		}

		// Verify token
		const decoded = verifyToken(token);

		// Attach user to req (without password)
		const user = await User.findById(decoded.id).select("-password");
		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user; // store user info in request
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ message: "Not authorized", error: error.message });
	}
};

// ------------------ ROLE-BASED AUTH ------------------
export const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res
				.status(403)
				.json({ message: "Access denied: insufficient permissions" });
		}
		next();
	};
};
