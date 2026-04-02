import Header from "../components/Header/header";
import { Footer } from "../components/footer/footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Header />

            <main className="main">
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default Layout;