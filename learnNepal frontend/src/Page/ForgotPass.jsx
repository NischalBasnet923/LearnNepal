import React from "react";
import CustomButton from "../components/button/button";

export const ForgotPass = () => {
  return (
    <div className="w-[560px] justify-center mx-auto bg-white rounded-xl shadow-md text-center px-7 pt-11 pb-20 self-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
      <div className="flex justify-end">
        <p>x</p>
      </div>
      <h1 className="text-2xl font-semibold mb-5">Forgot Password ?</h1>
      <p className="text-sm text-gray-500 mb-5">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
        consectetur varius ligula, sit amet gravida diam dapibus et. Quisque
        imperdiet.
      </p>
      <form action="post" className="flex flex-col gap-4 px-10">
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 mb-2 text-left">Email</p>
          <input
            type="email"
            placeholder="jhondeo@gmail.com"
            className="w-full h-[55px] p-2 border border-gray-300 rounded-md mb-5"
          />
        </div>
        <CustomButton text="Next"  bgColor="bg-black" textColor="text-white" />
      </form>
    </div>
  );
};
