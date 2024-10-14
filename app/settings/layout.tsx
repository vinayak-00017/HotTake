import Appbar from "@/components/appbar/Appbar";
import LeftSidebar from "@/components/LeftSidebar";
import SettingsHeader from "@/components/SettingsHeader";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <div className="root-container">
        <div className="wrapper">
          <Appbar></Appbar>
          <div className="grid grid-cols-layout">
            <LeftSidebar />
            <main>
              <SettingsHeader />
              {children}
            </main>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
