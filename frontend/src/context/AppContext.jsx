import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
 export const AppContext = createContext();
const AppContextProvider = (props) => {
  const [loader, setLoader] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([])
  const currencySymbol = '$'
  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): false)
  const [userData, setUserData] = useState(false)
  const getDoctorsData = async () => {

    try {
      setLoader(true)
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setLoader(false)
        setDoctors(data.doctors);
      } else {
        setLoader(false);
        toast.error(data.message);
      }
      
    } catch (err) {
      setLoader(false);
      console.log(err)
      toast.err(err.message)
    }
    
  }

  const loadProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {headers: {token}});
      if(data.success){
        setUserData(data.userProfile);
      }else{
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err);
      toast.err(err.message);
    }
  }

  useEffect(() => {
    if(token){

      loadProfileData()
    }
  }, [token])

 useEffect(() => {getDoctorsData()}, []);
  const value = {
    loader,
    setLoader,
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
