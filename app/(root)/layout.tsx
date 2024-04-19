import Appbar from "@/components/appbar/Appbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <div className="root-container">
        <div className="wrapper">
          <Appbar></Appbar>
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
