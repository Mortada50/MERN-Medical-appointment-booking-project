import doctorModel from "../models/doctorModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
// API to change doctor availablity
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctorData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });
    res.json({ success: true, message: "Availablity Changed" });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API to get all doctor's data
const getDoctorsData = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API for doctor login
const doctorLogin = async (req, res) => {

  try {

    const {email, password} = req.body;

    if(!email || !password) 
      return res.status(400).json({success: false, message: "Missing details"});

    if(!validator.isEmail(email)) 
      return res.status(400).json({success: false, message: "Invalid email"});

    const doctor = await doctorModel.findOne({email});

    if(!doctor) 
      return res.status(404).json({success: false, message: "Doctor not found"})

    if(!await bcrypt.compare(password, doctor.password)) 
      return res.status(400).json({success: false, message: "Invalid email or password"})
    
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRIT, { expiresIn: "30d" });

    return res.status(200).json({success: true, token})

  } catch (err) {

    console.log(err)

    res.status(500).json({success: false, message: err.message})
  
  }

}

// API to list doctor appointments
const listAppointments = async (req, res) => {

  try {

    const {docId} = req.body;
    
    const appointments = await appointmentModel.find({docId})

    if(appointments.length === 0) 
      return res.status(404).json({ success: false, message: "No appointments found" });
    
    return res.status(200).json({success: true, appointments}) 

  } catch (err) {

    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

// API to cancel an appointment
const cancelAppointment = async (req, res) => {

  try {
    
    const { docId, appointmentId } = req.body;

    if(!appointmentId || !docId)
      return res.status(400).json({success: false, message: "Missing details"})

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId !== docId)
      return res.status(404).json({ success: false, message: "Cancellation failed" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

    return res.status(200).json({success: true, message: "Appointment cancelled successfully"})

  } catch (err) {
    
    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

// API to make appointment completed
const completeAppointment = async (req, res) => {

  try {
    
    const { docId, appointmentId } = req.body;

    if (!appointmentId || !docId)
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment || appointment.docId !== docId)
      return res.status(404).json({ success: false, message: "Mark failed" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    return res.status(200).json({success: true, message: "Appointment copleted successfully"})

  } catch (err) {
        
    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

// API to get dashbord data for doctor pnal
const doctorDashbord = async (req, res) => {

  try {
    
    const {docId} = req.body;

    const appointments = await appointmentModel.find({docId});

    if(!appointments)
      return res.status(404).json({success: false, message: "No Data"})

    let earnings = 0;

    appointments.map((item) => (item.isCompleted || item.cancelled) && (earnings += item.amount));

    let patient = [];

    appointments.map((item) => !patient.includes(item.userId) && patient.push(item.userId));

    const dashData = {
      appointments: appointments.length,
      patient: patient.length,
      earnings: earnings,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.status(200).json({success: true, dashData});

  } catch (err) {
            
    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

// API to get doctor profile data
const getDoctorProfile = async (req, res) => {

  try {
    
    const {docId} = req.body;

    const profileData = await doctorModel.findById(docId).select("-password");

    if(!profileData)
      return res.status(404).josn({success: false, message: "No data found"});

    return res.status(200).json({success: true, profileData});

  } catch (err) {
                
    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

// API to edit doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {

  try {

    const {docId, fees, address, available } = req.body

    if(!fees || !address)
      return res.status(400).json({success: false, message: "Missing details"})

    await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

    res.status(200).json({success: true, message: "Updated successfully"})
    
  } catch (err) {
                    
    console.log(err);

    res.status(500).json({ success: false, message: err.message });
 
  }

}

export {
  changeAvailablity,
  getDoctorsData,
  doctorLogin,
  listAppointments,
  cancelAppointment,
  completeAppointment,
  doctorDashbord,
  getDoctorProfile,
  updateDoctorProfile,
};
