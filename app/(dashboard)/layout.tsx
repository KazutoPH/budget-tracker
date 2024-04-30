import NavBar from "../../components/nav/NavBar";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen w-full flex flex-col">
      <NavBar />
      <div className="w-full">{children}</div>
    </div>
  );
}

export default layout;
