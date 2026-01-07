import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-3 mt-0 pt-0">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Team 3. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;