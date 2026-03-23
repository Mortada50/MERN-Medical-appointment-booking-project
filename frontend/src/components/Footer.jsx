import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="glex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* -------------Left Section---------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
            sapiente et nisi temporibus hic corrupti recusandae laboriosam nihil
            voluptatem a voluptatibus numquam, quis unde consequuntur fugit ut
            deleniti repudiandae perspiciatis.
          </p>
        </div>
        {/* /-------------Left Section----------/ */}

        {/* -------------Center Section---------- */}
        <div>
          <p className="text-xl font-meduim mb-5">COMPANY</p>
          <ul className="glex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/* -------------Center Section---------- */}

        {/* -------------Right Section---------- */}
        <div>
          <p className="text-xl font-meduim mb-5">GET IN TOUCH</p>
          <ul className="glex flex-col gap-2 text-gray-600">
            <li>+967-730461816</li>
            <li>mortadaabdullahaltaj@gmail.com</li>
          </ul>
        </div>
        {/* -------------Right Section---------- */}
      </div>
      {/* --------------Copyright Text---------------- */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Right Reserved.</p>
      </div>
      {/* /--------------Copyright Text----------------/ */}
    </div>
  );
}

export default Footer
