import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import React from "react";

interface LobbyLayoutProps {
  children: React.ReactNode;
}

const LobbyLayout = ({ children }: LobbyLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default LobbyLayout;
