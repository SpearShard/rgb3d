"use client";

import { useEffect, useState } from "react";
import Navbar from "./navbar"

export default function AboutPage() {
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    setShowIframe(true);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Navbar/>
      {showIframe && (
        <iframe
          src="/landing_home/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Landing Page"
        />
      )}
    </div>
  );
}
