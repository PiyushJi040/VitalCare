import jwt from "jsonwebtoken";

// Generate JWT token with id + role
export const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Verify JWT token
export const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		throw new Error("Invalid or expired token");
	}
};
