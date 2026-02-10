import express from "express";
import {
	countDoctors,
	countTotalUsers,
	totalConsulations,
	getAllDoctors,
	getAllPatients,
	getAllHealthAssistants,
	deleteDoctor,
	deletePatient,
	deleteHealthAssistant,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/total-users", countTotalUsers);
adminRouter.get("/total-doctors", countDoctors);
adminRouter.get("/total-con", totalConsulations);
adminRouter.get("/doctors", getAllDoctors);
adminRouter.get("/patients", getAllPatients);
adminRouter.get("/health-assistants", getAllHealthAssistants);
adminRouter.delete("/doctors/:id", deleteDoctor);
adminRouter.delete("/patients/:id", deletePatient);
adminRouter.delete("/health-assistants/:id", deleteHealthAssistant);

export default adminRouter;
