import "./RegistrationForm.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchema } from "../../validation/registerSchema.js";
import { PatternFormat } from "react-number-format";
import { Controller } from "react-hook-form";
import { registerUser } from "../../api/authApi";

const RegistrationForm = ({ role }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(getRegisterSchema(role)),
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone.replace(/\D/g, ""),
                password: data.password,
                ...(role === "employer" && { tin: data.tin }),
            };

            const res = await registerUser(role, payload);

            console.log("SUCCESS:", res.data);
            alert("Регистрация успешна");

        } catch (e) {
            console.error("ERROR FULL:", e);
            alert(e.response?.data?.message || "Ошибка регистрации");
        }
    };

    return (
        <section className="employer">
            <section className="employer__cont">
                <h2>Регистрация</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="employer__form">

                    <div className="employer__input-cont">

                        <p>
                            <label>Почта</label>
                            <input {...register("email")} placeholder="Введите почту" />
                            <span className="error">{errors.email?.message}</span>
                        </p>

                        <p>
                            <label>Телефон</label>

                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <PatternFormat
                                        {...field}
                                        format="8 (9##) ###-##-##"
                                        mask="_"
                                        placeholder="8 (9__) ___-__-__"
                                        onValueChange={(values) => {
                                            let phone = values.value;

                                            if (phone.length === 11) {
                                                phone = "89" + phone.slice(2);
                                                field.onChange(phone);
                                            } else {
                                                field.onChange("");
                                            }
                                        }}
                                    />
                                )}
                            />

                            <span className="error">{errors.phone?.message}</span>
                        </p>

                        <p>
                            <label>Имя</label>
                            <input {...register("name")} />
                            <span className="error">{errors.name?.message}</span>
                        </p>

                        <p>
                            <label>Фамилия</label>
                            <input {...register("surname")} />
                            <span className="error">{errors.surname?.message}</span>
                        </p>
                    </div>

                    <div className="employer__input-cont">

                        <p>
                            <label>Пароль</label>
                            <input type="password" {...register("password")} />
                            <span className="error">{errors.password?.message}</span>
                        </p>

                        <p>
                            <label>Повторите пароль</label>
                            <input type="password" {...register("confirmPassword")} />
                            <span className="error">{errors.confirmPassword?.message}</span>
                        </p>

                        {role === "employer" && (
                            <p>
                                <label>ИНН</label>
                                <input {...register("tin")} />
                                <span className="error">{errors.tin?.message}</span>
                            </p>
                        )}

                        <button type="submit">Зарегистрироваться</button>

                    </div>
                </form>
            </section>
        </section>
    );
};

export default RegistrationForm;