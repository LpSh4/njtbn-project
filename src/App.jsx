import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/header.jsx";
import { Footer } from "./components/footer/footer.jsx";
import Home from "./pages/Home/home.jsx";
import RegistrationChoose from "./pages/RegistrationChoose/RegistrationChoose.jsx";
import { ModalLogin } from "./components/ModalLogin/modalLogin.jsx";
import RegistrationEmployer from "./pages/RegistrationEmployer/RegistrationEmployer.jsx";
import {RegistrationSpecialist} from "./pages/RegistrationSpecialist/RegistrationSpecialist.jsx";


const App = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <Header setIsLoginOpen={setIsLoginOpen} />

            <main className={`main ${isLoginOpen ? "blur" : ""}`}>
             <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registerChoose" element={<RegistrationChoose />} />
                    <Route path="/registerEmployer" element={<RegistrationEmployer />} />
                 <Route path="/registerSpecialist" element={<RegistrationSpecialist />} />
                </Routes>
            </main>

            <ModalLogin
                isOpen={isLoginOpen}
                setIsOpen={setIsLoginOpen}
            />

            <Footer />
        </>
    );
};

export default App;