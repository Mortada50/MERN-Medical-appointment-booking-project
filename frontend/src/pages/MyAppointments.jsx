import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, token, setLoader, getDoctorsData } =
    useContext(AppContext);
  const [appointment, setAppointment] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("-");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };
  const getUserAppointments = async () => {
    try {
      setLoader(true);
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setLoader(false);
        setAppointment(data.appointments.reverse());
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, []);

  const cancelAppointmentHandler = async (appointmentId) => {
    try {
      setLoader(true);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        getUserAppointments();
        getDoctorsData();
        setLoader(false);
        toast.success(data.message);
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // create option for order payment <order: come from api responce>
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      // when payment excuted successfully the response come from this handler function
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/",
            response,
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (err) {
          console.log(err);
          toast.error(err.message);
        }
      },
    };

    // init the payment
    const rzp = new window.Razorpay(options);
    // to open razorpay window poupup
    rzp.open();
  };
  // payment for appointment fee
  const appointmentRazorpay = async (appointmentId) => {
    try {
      setLoader(true);
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      toast.error(err.response?.data?.message || err.message);
    }
  };
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointment.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}>
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.speciality}</p>
              <p className="text-zinc=700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded-full text-stone-500 bg-indigo-50 cursor-pointer">
                  Paid
                </button>
              )}
              {!item.cancelled &&
                !item.payment && !item.isCompleted &&(
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 rounded-full cursor-pointer">
                    Pay Online
                  </button>
                )}
              {!item.cancelled && !item.isCompleted &&(
                <button
                  onClick={() => {
                    cancelAppointmentHandler(item._id);
                  }}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 rounded-full cursor-pointer">
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted &&(
                <button className="sm:min-w-48 py-2 border border-red-500 rounded-full text-red-500 cursor-pointer">
                  Appointment cancelled
                </button>
              )}
              {
                item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded-full text-green-500 cursor-pointer">Completed</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
