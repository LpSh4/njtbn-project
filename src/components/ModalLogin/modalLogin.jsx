import "./modalLogin.scss";
import close from "./icons/close.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { loginUser, getUser, getMe } from "../../api/authApi";

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
            await loginUser({
                email: data.email,
                password: data.password
            });

            const meRes = await getMe();
            const { id, role } = meRes.data.data;

            const userRes = await getUser(id);

            login({
                ...userRes.data.data,
                role
            });

            setIsOpen(false);
            navigate("/profile");

        } catch (e) {
            console.error("LOGIN ERROR:", e.response?.data || e);
            alert("Ошибка входа");
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
                <h2>Войдите в аккаунт</h2>

                <div className="modalLogin__input-field">
                    <div className="modalLogin__text-cont">

                        <p>
                            <label>Email</label>
                            <input {...register("email", { required: "Введите email" })} type="email" />
                            <span className="error">{errors.email?.message}</span>
                        </p>

                        <p>
                            <label>Пароль</label>
                            <input {...register("password", { required: "Введите пароль" })} type="password" />
                            <span className="error">{errors.password?.message}</span>
                        </p>

                    </div>

                    <button type="submit">Войти</button>

                    <p
                        style={{ cursor: "pointer", marginTop: "10px" }}
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/registerChoose");
                        }}
                    >
                        Впервые здесь? Зарегистрироваться
                    </p>
                </div>
            </form>
        </section>
    );
};