import React from "react";
import Footer from "../../components/users/Footer";
import Menu from "../../components/users/menu";
import Navbar from "../../components/users/Navbar";
import Newletter from "../../components/users/Newletter";
const AppUser = ({ children }) => {
    return (
        <>
            <Menu />
            <Navbar />
            {children}
            <Newletter />
            <Footer />
        </>
    );
}

export default AppUser;