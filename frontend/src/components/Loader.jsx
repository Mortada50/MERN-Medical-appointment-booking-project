import React, { useContext } from 'react'
import { Rings } from "react-loader-spinner";
import { AppContext } from '../context/AppContext';
const Loader = () => {
    const {loader} = useContext(AppContext)
  return loader && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Rings
        visible={true}
        height="100"
        width="100"
        color="#5f6FFF"
        ariaLabel="rings-loading"
      />
    </div>
  );
}

export default Loader
