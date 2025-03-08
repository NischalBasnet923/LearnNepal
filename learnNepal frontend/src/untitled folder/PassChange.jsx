import React from "react";
import CustomButton from "../../components/basic components/button";

export const PassChange = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl rounded-xl">
      <div className="w-[500px] rounded-2xl px-10 py-10 pb-14 text-center border border-gray-100 flex flex-col gap-1">
        <div className="self-end">
          <p>x</p>
        </div>
        <h1 className="text-[24px] font-medium">Change Password</h1>
        <p className="text-[12px] text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
          consectetur varius ligula, sit amet gravida diam dapibus et. Quisque
          imperdiet.
        </p>
        <form action="post" className="px-7 mt-6">
          <p className="text-[14px] text-gray-500 text-left">Password</p>
          <input
            type="email"
            placeholder="*********"
            className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-5"
          />
          <p className="text-[14px] text-gray-500 text-left">
            Confirm Password
          </p>
          <input
            type="email"
            placeholder="*********"
            className="w-full h-[45px] p-2 border border-gray-300 rounded-md mb-10"
          />
          <CustomButton text="Change Password" onClick={() => {}} />
        </form>
      </div>
    </div>
  );
};
