import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/route"
import DefaultLayout from "./components/layout/DefaultLayout/index";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'antd/dist/antd.css';
import { Fragment } from "react";
import AppUser from "./pages/users/AppUser";
import { Menu } from "react-feather";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Layout = route.Layout === null ? Fragment : DefaultLayout;
            const Page = route.component;
            return <Route key={index} path={route.path} element={
              <Layout>
                <Page />
              </Layout>
            } />
          })}

          <Route path="user" element={<AppUser></AppUser>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
