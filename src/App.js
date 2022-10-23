import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/route"
import DefaultLayout from "./components/layout/DefaultLayout/index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'antd/dist/antd.css';
import { Fragment } from "react";
import Footer from "./components/users/Footer";
import Menu from "./components/users/menu";
import Navbar from "./components/users/Navbar";
import Newletter from "./components/users/Newletter";
import HomeUser from "../src/pages/customer/HomeUser";
import AppUser from "./pages/customer/AppUser";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.Layout === null ? Fragment : DefaultLayout;
            const LayoutCustomer = route.Layout === null ? Fragment : AppUser;
            const Page = route.component;
            if(route.path.includes("/admin")){
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            }else{
              return <Route key={index} path={route.path} element={
                <LayoutCustomer>
                  <Page />
                </LayoutCustomer>
              } />
              // <>
              // <Menu />
              // <Navbar />
              // <HomeUser></HomeUser>
              // <Newletter />
              // <Footer />
              //  </>
            }
            
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
