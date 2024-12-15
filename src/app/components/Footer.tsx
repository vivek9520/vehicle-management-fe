import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#001A6E] text-[#D4EBF8] py-6 shadow-t-md">
      <div className="container mx-auto text-center">
        <p className="text-white">© {new Date().getFullYear()} NHO - All Rights Reserved.</p>
       
      </div>
    </footer>
  );
};

export default Footer;
