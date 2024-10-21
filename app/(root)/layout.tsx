import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Appbar from "@/components/appbar/Appbar";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <div className="root-container">
        <div className="wrapper">
          <Appbar />
          <div className="grid grid-cols-layout">
            <LeftSidebar />
            <main>{children}</main>
            <RightSidebar />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
