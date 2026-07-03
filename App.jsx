import "./global.css";
import {axiosInstance} from "./src/api/axios";
import React, { useEffect } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { setupAxiosInterceptors } from "./src/api/axios.interceptor";


const App = () => {

  useEffect(() => {
  const test = async () => {
    try {
      const res = await axiosInstance.get("/health");
      console.log(res.data);
      alert("route matched")
    } catch (error) {
      console.log(error.response?.data);
      alert(error)
    }
  };

  test();
}, []);

 useEffect(() => {
    setupAxiosInterceptors();
  }, []);




  return <RootNavigator />;
};

export default App;
