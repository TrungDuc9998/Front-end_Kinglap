import React from "react";
import Footer from "../../components/layout/users/Footer";
import Menu from "../../components/layout/users/menu";
import Navbar from "../../components/layout/users/Navbar";
import Newletter from "../../components/layout/users/Newletter";
import HomeUser from "./HomeUser";

function AppUser() {
    return (
        <>
            <Menu />
            <Navbar />
            <HomeUser></HomeUser>
            <Newletter />
            <Footer />
        </>
    );
}

export default AppUser;