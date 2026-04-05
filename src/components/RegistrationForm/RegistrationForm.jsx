import "./RegistrationForm.scss"
import { useState } from "react";

export const RegistrationForm = ({ role }) => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        name: "",
        surname: "",
        password: "",
        confirmPassword: "",
        inn: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        console.log(formData);
    };

    return(
        <>
            <section className="employer">
                <section className="employer__cont">
                    <h2>Регистрация</h2>
                    <form onSubmit={handleSubmit} className="employer__form" action="">
                        <div className="employer__input-cont">
                            <p>
                                <label htmlFor="">Почта</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Введите вашу почту"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </p>
                            <p>
                                <label htmlFor="">Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Введите ваш номер телефона"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </p>
                            <p>
                                <label htmlFor="">Имя</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Введите ваше имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </p>
                            <p>
                                <label htmlFor="">Фамилия</label>
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Введите вашу фамилию"
                                    value={formData.surname}
                                    onChange={handleChange}
                                />
                            </p>
                        </div>

                        <div className="employer__input-cont">
                            <p>
                                <label htmlFor="">Пароль</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </p>
                            <p>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Подвтердите пароль"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </p>

                            {role === "employer" && (
                                <p>
                                    <label>ИНН</label>
                                    <input
                                        type="text"
                                        name="inn"
                                        placeholder="Введите ИНН"
                                        value={formData.inn}
                                        onChange={handleChange}
                                    />
                                </p>
                            )}
                            <button>Зарегистрироваться</button>
                        </div>


                    </form>
                </section>
            </section>
        </>
    )
}
export default RegistrationForm;
