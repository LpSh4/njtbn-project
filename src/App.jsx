import { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/header.jsx";
import { Footer } from "./components/footer/footer.jsx";

import Home from "./pages/Home/home.jsx";
import RegistrationChoose from "./pages/RegistrationChoose/RegistrationChoose.jsx";
import RegistrationEmployer from "./pages/RegistrationEmployer/RegistrationEmployer.jsx";
import { RegistrationSpecialist } from "./pages/RegistrationSpecialist/RegistrationSpecialist.jsx";

import { ProfileRedirect } from "./components/profile/profile.jsx";
import { ProfileEmployer } from "./pages/profileEmployer/profileEmployer.jsx";
import { ProfileSpecialist } from "./pages/ProfileSpecialist/ProfileSpecialist.jsx";

import { CreateResume } from "./pages/CreateResume/CreateResume.jsx";
import { CreateVacancy } from "./pages/CreateVacancy/CreateVacancy.jsx";

import { ResumeDeclarations } from "./pages/ResumeDeclarations/ResumeDeclarations.jsx";
import { VacancyDeclarations } from "./pages/VacancyDeclarations/VacancyDeclarations.jsx";

import { ResumeView } from "./pages/ResumeView/ResumeView.jsx";
import { VacancyView } from "./pages/VacancyView/VacancyView.jsx";

import { ModalLogin } from "./components/ModalLogin/modalLogin.jsx";
import { AuthContext } from "./context/AuthContext";

const App = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Header setIsLoginOpen={setIsLoginOpen} />

            <main className={`main ${isLoginOpen ? "blur" : ""}`}>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <Home
                                isLoginOpen={isLoginOpen}
                                setIsLoginOpen={setIsLoginOpen}
                            />
                        }
                    />

                    <Route path="/registerChoose" element={<RegistrationChoose />} />
                    <Route path="/registerEmployer" element={<RegistrationEmployer />} />
                    <Route path="/registerSpecialist" element={<RegistrationSpecialist />} />

                    <Route path="/profile" element={<ProfileRedirect />} />
                    <Route path="/profileEmployer" element={<ProfileEmployer />} />
                    <Route path="/profileSpecialist" element={<ProfileSpecialist />} />

                    <Route path="/createResume" element={<CreateResume />} />
                    <Route path="/createVacancy" element={<CreateVacancy />} />

                    <Route path="/resumes" element={<ResumeDeclarations />} />
                    <Route path="/vacancies" element={<VacancyDeclarations />} />

                    <Route path="/resume/:id" element={<ResumeView />} />
                    <Route path="/vacancy/:id" element={<VacancyView />} />

                </Routes>
            </main>

            <ModalLogin isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

            <Footer />
        </>
    );
};

export default App;