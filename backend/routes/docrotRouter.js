import express from "express";
import {
  getDoctorsData,
  doctorLogin,
  listAppointments,
  cancelAppointment,
  completeAppointment,
  doctorDashbord,
  getDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();

doctorRouter.get("/list", getDoctorsData);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/appointments",authDoctor, listAppointments);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointment)
doctorRouter.post("/compelte-appointment", authDoctor, completeAppointment);
doctorRouter.get("/dashboard", authDoctor, doctorDashbord);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
export default doctorRouter;
