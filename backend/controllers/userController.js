import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

// API for register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Enter a Valid Email" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ success: false, message: "Enter a Strong Password" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = userModel(userData);
    const user = await newUser.save();

    // generate user token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRIT, {
      expiresIn: "30d",
    });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.log("Catch an error: ", err);
    res.json({ success: false, message: err.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    const userData = await userModel.findOne({ email });
    if (userData) {
      if (await bcrypt.compare(password, userData.password)) {
        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRIT, {
          expiresIn: "30d",
        });
        return res.status(200).json({ success: true, token });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      console.log(userData);
      res.status(404).json({ success: false, message: "User dose not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userProfile = await userModel.findById(userId).select("-password");
    res.status(200).json({ success: true, userProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API for updateing user profile data
const updateProfile = async (req, res) => {
  try {
    const { userId, name, address, dob, phone, gender } = req.body;
    const imageFile = req.file;

    if (!name || !address || !dob || !phone || !gender)
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    await userModel.findByIdAndUpdate(userId, {
      name,
      address: JSON.parse(address),
      dob,
      phone,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    if (!userId || !docId || !slotDate || !slotTime)
      return res
        .status(400)
        .json({ success: false, message: "Missing detailse" });

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available)
      return res
        .status(400)
        .json({ success: false, message: "Doctor not available" });

    let slotsBooked = docData.slots_booked;

    // cheecking for slot availablity
    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res
          .status(409)
          .json({ success: false, message: "Slot not available" });
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointment = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointment);
    await newAppointment.save();

    // save new slots data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res
      .status(201)
      .json({ success: true, message: "Appointment booked successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to get user appointments
const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    if (!appointments)
      return res
        .status(404)
        .json({ success: false, message: "There are no appointments" });
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to cancel user appointment
const cancelAppointmet = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify apointment
    if (appointmentData.userId !== userId)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized action" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slotsBooked = doctorData.slots_booked;
    slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e !== slotTime);
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.status(200).json({ success: true, message: "Appointment cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// init razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Appointment cancelled or not found",
        });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // it will remove the two decimal points
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an order
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointmet,
  paymentRazorpay,
  verifyRazorpay,
};
