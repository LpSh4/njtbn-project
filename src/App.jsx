import { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import { CreateVacancy } from "./pages/CreateVacancy/createVacancy.jsx";

import { ResumeDeclarations } from "./pages/ResumeDeclarations/ResumeDeclarations.jsx";
import { VacancyDeclarations } from "./pages/VacancyDeclarations/VacancyDeclarations.jsx";

import { ResumeView } from "./pages/ResumeView/ResumeView.jsx";
import { VacancyView } from "./pages/VacancyView/VacancyView.jsx";

import { ModalLogin } from "./components/ModalLogin/modalLogin.jsx";
import { AuthContext } from "./context/AuthContext";

const PublicRoute = ({ user, children }) => {
    if (user) {
        return user.role === "employer"
            ? <Navigate to="/profileEmployer" replace />
            : <Navigate to="/profileSpecialist" replace />;
    }
    return children;
};

const App = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { loading, user } = useContext(AuthContext);

    const handleToggleLogin = (value) => {
        setIsLoginOpen(prev => {
            if (prev === value) return prev;
            return value;
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Header setIsLoginOpen={handleToggleLogin} />

            <main className={`main ${isLoginOpen ? "blur" : ""}`}>
                <Routes>
                    {}
                    <Route
                        path="/"
                        element={
                            <PublicRoute user={user}>
                                <Home isLoginOpen={isLoginOpen} setIsLoginOpen={handleToggleLogin} />
                            </PublicRoute>
                        }
                    />
                    <Route path="/registerChoose" element={<PublicRoute user={user}><RegistrationChoose /></PublicRoute>} />
                    <Route path="/registerEmployer" element={<PublicRoute user={user}><RegistrationEmployer /></PublicRoute>} />
                    <Route path="/registerSpecialist" element={<PublicRoute user={user}><RegistrationSpecialist /></PublicRoute>} />

                    {}
                    <Route path="/profile" element={<ProfileRedirect />} />
                    <Route path="/profileEmployer" element={<ProfileEmployer />} />
                    <Route path="/profileSpecialist" element={<ProfileSpecialist />} />

                    {}
                    <Route path="/createResume" element={<CreateResume />} />
                    <Route path="/createVacancy" element={<CreateVacancy />} />

                    {}
                    <Route path="/resumes" element={<ResumeDeclarations setIsLoginOpen={handleToggleLogin} />} />
                    <Route path="/vacancies" element={<VacancyDeclarations setIsLoginOpen={handleToggleLogin} />} />

                    {}
                    <Route path="/resume/:id" element={<ResumeView setIsLoginOpen={handleToggleLogin} />} />
                    <Route path="/vacancy/:id" element={<VacancyView setIsLoginOpen={handleToggleLogin} />} />
                </Routes>
            </main>

            <ModalLogin isOpen={isLoginOpen} setIsOpen={handleToggleLogin} />
            <Footer />
        </>
    );
};

export default App;