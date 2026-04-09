import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/header.jsx";
import { Footer } from "./components/footer/footer.jsx";
import Home from "./pages/Home/home.jsx";
import RegistrationChoose from "./pages/RegistrationChoose/RegistrationChoose.jsx";
import { ModalLogin } from "./components/ModalLogin/modalLogin.jsx";
import RegistrationEmployer from "./pages/RegistrationEmployer/RegistrationEmployer.jsx";
import {RegistrationSpecialist} from "./pages/RegistrationSpecialist/RegistrationSpecialist.jsx";
import {ProfileRedirect} from "./components/profile/profile.jsx";
import {ProfileEmployer } from "./pages/profileEmployer/profileEmployer.jsx";
import {ProfileSpecialist  } from "./pages/ProfileSpecialist/ProfileSpecialist.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import {CreateResume} from "./pages/CreateResume/CreateResume.jsx";
import {CreateVacancy} from "./pages/CreateVacancy/CreateVacancy.jsx";
import {ResumeDeclarations } from "./pages/ResumeDeclarations/ResumeDeclarations.jsx"
import {VacancyDeclarations} from "./pages/VacancyDeclarations/VacancyDeclarations.jsx"

const App = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    return (
        <>
            <Header setIsLoginOpen={setIsLoginOpen} />

            <main className={`main ${isLoginOpen ? "blur" : ""}`}>
             <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registerChoose" element={<RegistrationChoose />} />
                    <Route path="/registerEmployer" element={<RegistrationEmployer />} />
                 <Route path="/registerSpecialist" element={<RegistrationSpecialist />} />
                 <Route path="/profile" element={<ProfileRedirect/>} />
                 <Route path="/profileEmployer" element={<ProfileEmployer />} />
                 <Route path="/profileSpecialist" element={<ProfileSpecialist />} />
                 <Route path="/createResume" element={<CreateResume />} />
                 <Route path="/createVacancy" element={<CreateVacancy />} />
                 <Route path="/resumes" element={<ResumeDeclarations />} />
                 <Route path="/vacancies" element={<VacancyDeclarations />} />
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