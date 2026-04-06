import * as yup from "yup";

export const getRegisterSchema = (role) =>
    yup.object({
        email: yup
            .string()
            .email("Некорректная почта")
            .required("Введите почту"),

            phone: yup
                .string()
                .min(11, "Введите полный номер")
                .required("Введите телефон"),

        name: yup
            .string()
            .min(2, "Минимум 2 символа")
            .required("Введите имя"),

        surname: yup
            .string()
            .min(2, "Минимум 2 символа")
            .required("Введите фамилию"),

        password: yup
            .string()
            .min(6, "Минимум 6 символов")
            .required("Введите пароль"),

        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Пароли не совпадают")
            .required("Подтвердите пароль"),

            tin:
                role === "employer"
                    ? yup
                        .string()
                        .matches(/^\d{10,12}$/, "ИНН должен содержать 10-12 цифр")
                        .required("Введите ИНН")
                    : yup.string().notRequired(),
    });