import "./modalLogin.scss";
import close from "./icons/close.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";

export const ModalLogin = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await loginUser({
                email: data.email,
                password: data.password
            });

            login(res.data.data);

            setIsOpen(false);

            const role = res.data.data.role;

            if (role === "employer") navigate("/profileEmployer");
            else if (role === "specialist") navigate("/profileSpecialist");
            else navigate("/");

        } catch (e) {
            console.error("LOGIN ERROR:", e.response?.data || e);
            alert("Login error");
        }
    };

    return (
        <section className={`modalLogin ${isOpen ? "active" : ""}`}>
            <div className="modalLogin__close">
                <button onClick={() => setIsOpen(false)}>
                    <img src={close} alt="" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="modalLogin__form">
                <h2>Log in to your account</h2>

                <div className="modalLogin__input-field">
                    <div className="modalLogin__text-cont">

                        <p>
                            <label>Email</label>
                            <input {...register("email", { required: "Enter your email address" })} type="email" />
                            <span className="error">{errors.email?.message}</span>
                        </p>

                        <p>
                            <label>Password</label>
                            <input {...register("password", { required: "Enter the password" })} type="password" />
                            <span className="error">{errors.password?.message}</span>
                        </p>

                    </div>

                    <button type="submit">SignIn</button>

                    <p
                        style={{ cursor: "pointer", marginTop: "10px" }}
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/registerChoose");
                        }}
                    >
                        Is this your first time here? Register
                    </p>
                </div>
            </form>
        </section>
    );
};