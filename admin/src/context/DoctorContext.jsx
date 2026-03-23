import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios"
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

  const [dToken, setDToken] = useState(localStorage.getItem("dToken")? localStorage.getItem("dToken"): '')
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [appointments, setAppointmetns] = useState([]);
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)
  const getAppointments = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + "/api/doctor/appointments", {headers: {dToken}});

      if(data.success){
        setAppointmetns(data.appointments.reverse())
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {
      
      const {data} = await axios.post(backendUrl + "/api/doctor/cancel-appointment", {appointmentId}, {headers: {dToken}})

      if(data.success){

        toast.success(data.message)
        getAppointments()
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

  }

  const compelteAppointment = async (appointmentId) => {

    try {
      
      const {data} = await axios.post(backendUrl + "/api/doctor/compelte-appointment", {appointmentId}, {headers: {dToken}})

      if(data.success){
        
        toast.success(data.message)
        getAppointments()

      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

  }

  const getDashData = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + "/api/doctor/dashboard", {headers: {dToken}});

      if(data.success){
        setDashData(data.dashData);
        console.log(data.dashData)
      }

    } catch (err) {
      
      toast.error(err.response?.data?.message || err.message);

    }

  }

  const getProfileData = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + "/api/doctor/profile", {headers: {dToken}})

      if(data.success){

        setProfileData(data.profileData);
      }

    } catch (err) {
            
      toast.error(err.response?.data?.message || err.message);

    }

  }

  const value = {
    setDToken,
    dToken,
    backendUrl,
    getAppointments,
    appointments,
    cancelAppointment,
    compelteAppointment,
    getDashData,
    dashData,
    setDashData,
    getProfileData,
    profileData,
    setProfileData,
  };
  return (
    <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
