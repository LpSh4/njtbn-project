import * as yup from "yup";

export const getRegisterSchema = (role) =>
    yup.object({
        email: yup
            .string()
            .email("Invalid email address")
            .required("Enter your email"),

        phone: yup
            .string()
            .min(11, "Enter a full phone number")
            .required("Enter your phone number"),

        name: yup
            .string()
            .min(2, "Minimum 2 characters")
            .required("Enter your first name"),

        surname: yup
            .string()
            .min(2, "Minimum 2 characters")
            .required("Enter your last name"),

        password: yup
            .string()
            .min(6, "Minimum 6 characters")
            .required("Enter your password"),

        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords do not match")
            .required("Confirm your password"),

        tin: role === "employer"
            ? yup
                .string()
                .matches(/^\d{10,12}$/, "TIN must contain 10-12 digits")
                .required("Enter your TIN")
            : yup.string().notRequired(),
    });