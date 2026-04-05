import "./modalLogin.scss";
import close from "./icons/close.svg";
import { useNavigate } from "react-router-dom";

export const ModalLogin = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    return (
        <section className={`modalLogin ${isOpen ? "active" : ""}`}>
           <div className="modalLogin__close"> <button onClick={() => setIsOpen(false)}><img src={close} alt=""/></button></div>

            <form className="modalLogin__form">
                <h2>Войдите в аккаунт</h2>

                <div className="modalLogin__input-field">
                    <div className="modalLogin__text-cont">
                        <p>
                            <label>Логин</label>
                            <input placeholder="Введите логин" type="text" />
                        </p>

                        <p>
                            <label>Пароль</label>
                            <input placeholder="Введите пароль" type="text" />
                        </p>
                    </div>

                    <button type="submit">Войти</button>
                </div>
            </form>

            Вот готовый исправленный кусок:

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