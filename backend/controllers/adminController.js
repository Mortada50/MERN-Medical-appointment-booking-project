import doctorModel from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
// API FOR ADDING DOCTOR
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    )
      res.json({ success: false, message: "Massing detiales" });

    if (!validator.isEmail(email))
      res.json({ success: false, message: "Please enter a valid email" });
    if (password.lenght < 8)
      res.json({ success: false, message: "Please enter a strong password" });
    const slat = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, slat);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
      image: imageUrl,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "new doctor added" });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRIT);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid email " });
    }
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API to get all doctors list for admin panel

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API to get appointmets list
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    return res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    if (appointment.cancelled)
      return res
        .status(200)
        .json({ success: true, message: "Appointment cancelled successfully" });
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointment;
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    let slotsBooked = docData.slots_booked;
    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate] = slotsBooked[slotDate].filter(
        (e) => e !== slotTime
      );
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    return res
      .status(200)
      .json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const appointments = await appointmentModel.find({});
    const users = await userModel.find({});

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.status(200).json({ success: true, dashData });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};
export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentAdmin,
  cancelAppointment,
  adminDashboard,
};
