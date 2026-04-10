import "./RegistrationForm.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchema } from "../../validation/registerSchema.js";
import { PatternFormat } from "react-number-format";
import { Controller } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";


const RegistrationForm = ({ role }) => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(getRegisterSchema(role)),
        defaultValues: {
            email: "",
            phone: "",
            name: "",
            surname: "",
            password: "",
            confirmPassword: "",
            tin: "",
        },
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

            await registerUser(role, payload);

            await loginUser({
                email: data.email,
                password: data.password,
            });


            login();

            navigate("/profile");

        } catch (e) {
            console.error(e);
            alert(e.response?.data?.message || "Registration error");
        }
    };
    console.log(errors);
    return (
        <section className="employer">
            <section className="employer__cont">
                <h2>Registration</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="employer__form">

                    <div className="employer__input-cont">

                        <p>
                            <label>Mail</label>
                            <input {...register("email")} placeholder="Enter your email" />
                            <span className="error">{errors.email?.message}</span>
                        </p>

                        <p>
                            <label>Tel</label>

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
                                            field.onChange(values.value);
                                        }}
                                    />
                                )}
                            />

                            <span className="error">{errors.phone?.message}</span>
                        </p>

                        <p>
                            <label>Name</label>
                            <input {...register("name")} />
                            <span className="error">{errors.name?.message}</span>
                        </p>

                        <p>
                            <label>First Name</label>
                            <input {...register("surname")} />
                            <span className="error">{errors.surname?.message}</span>
                        </p>
                    </div>

                    <div className="employer__input-cont">

                        <p>
                            <label>Password</label>
                            <input type="password" {...register("password")} />
                            <span className="error">{errors.password?.message}</span>
                        </p>

                        <p>
                            <label>Repeat the password</label>
                            <input type="password" {...register("confirmPassword")} />
                            <span className="error">{errors.confirmPassword?.message}</span>
                        </p>

                        {role === "employer" && (
                            <p>
                                <label>TIN</label>
                                <input maxLength={12} minLength={10} {...register("tin")} />
                                <span className="error">{errors.tin?.message}</span>
                            </p>
                        )}

                        <button type="submit">Register</button>

                    </div>
                </form>
            </section>
        </section>
    );
};

export default RegistrationForm;