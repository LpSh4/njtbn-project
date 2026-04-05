import "./modalLogin.scss";
import close from "./icons/close.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/authApi";

export const ModalLogin = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

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

            console.log("LOGIN SUCCESS:", res.data);


            localStorage.setItem("token", res.data.token);

            alert("Вы вошли!");

            setIsOpen(false);
            navigate("/");

        } catch (e) {
            console.error("LOGIN ERROR:", e.response?.data);

            alert(
                e.response?.data?.message ||
                "Ошибка входа"
            );
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
                            <input
                                {...register("email", { required: "Введите email" })}
                                placeholder="Введите email"
                                type="email"
                            />
                            <span className="error">{errors.email?.message}</span>
                        </p>

                        <p>
                            <label>Пароль</label>
                            <input
                                {...register("password", { required: "Введите пароль" })}
                                placeholder="Введите пароль"
                                type="password"
                            />
                            <span className="error">{errors.password?.message}</span>
                        </p>

                    </div>

                    <button type="submit">Войти</button>
                </div>
            </form>

            <p
                style={{ cursor: "pointer", marginTop: "10px" }}
                onClick={() => {
                    setIsOpen(false);
                    navigate("/registerChoose");
                }}
            >
                Впервые здесь? Зарегистрироваться
            </p>
        </section>
    );
};