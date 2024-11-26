import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#8174A0] text-white py-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} NHO - All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
