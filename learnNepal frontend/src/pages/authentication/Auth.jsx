import React from "react";
import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <div>{<Outlet />}</div>
    </div>
  );
};

export default Auth;
