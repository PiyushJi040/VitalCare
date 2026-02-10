import { Schema, model } from "mongoose";
import pkg from "bcryptjs";
const { hash, compare } = pkg;

const options = { discriminatorKey: "role", timestamps: true };

const baseUserSchema = new Schema(
	{
		name: { type: String, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true, minlength: 6 },
		location: { type: String, trim: true },
	},
	options
);

// Password hashing
baseUserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await hash(this.password, 12);
	next();
});

baseUserSchema.methods.comparePassword = async function (candidatePassword) {
	return await compare(candidatePassword, this.password);
};

const User = model("User", baseUserSchema);

// Doctor discriminator
export const Doctor = User.discriminator(
	"doctor",
	new Schema({
		specialisation: { type: String, required: true },
		qualification: String,
		experience: { type: Number, default: 0 },
		rating: { type: Number, default: 0 },
		currentPatients: { type: Number, default: 0 },
		maxPatients: { type: Number, default: 5 },
		isOnline: { type: Boolean, default: false }, // ✅ key field for Socket.IO
		lastActive: { type: Date }, // optional: useful for "last seen"
	})
);

// Health Assistant discriminator
export const HealthAssistant = User.discriminator(
	"healthAssistant",
	new Schema({})
);

// Pharmacy Manager discriminator
export const PharmacyManager = User.discriminator(
	"pharmacyManager",
	new Schema({
		storeName: String,
	})
);

export default User;
