import express from "express";
import {
	getWaitingPatients,
	registerPatientVisit,
} from "../controllers/patient.controller.js";

const PatientRouter = express.Router();

PatientRouter.post("/register", registerPatientVisit);
PatientRouter.get("/waiting", getWaitingPatients);

export default PatientRouter;
