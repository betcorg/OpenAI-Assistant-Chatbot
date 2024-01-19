import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const Signup = () => {
    let usernameError = false;
    let emailError = false;
    let passwordError = false;

    let initialValues = {
        username: "",
        email: "",
        password: ""
    }

    const validateUsername = (value) => {
        let error;
        if (!value) {
            error = "Nombre de usuario requerido";
            usernameError = true;
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
            error = "Tu nombre de usuario sólo puede tener letras y números";
            usernameError = true;
        } else {
            usernameError = false;
        }
        return error;
    };

    const validateEmail = (value) => {
        let error;
        if (!value) {
            error = "Email requerido";
            emailError = true;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            error = "Introduce un email válido";
            emailError = true;
        } else {
            emailError = false;
        }

        return error;
    };

    const validatePassword = (value) => {
        let error;
        if (!value) {
            error = "Contraseña requerida";
            passwordError = true;
        } else if (value.length < 8) {
            error = "La contraseña debe tener al menos 8 caracteres";
            passwordError = true;
        } else {
            passwordError = false;
        }
        return error;
    };

    const handleSubmit = async (values) => {

        const data = {
            username: values.username,
            email: values.email,
            password: values.password,
        };

        const config = {
            method: "post",
            url: "http://localhost:3000/api/v1/signup",
            headers: {
                "Content-Type": "application/json"
            },
            data
        };
        try {
            const response = await axios(config);
            console.log(response.data);

        } catch (error) {
            console.log(error.response.data.message);
        }

    }


return (
        <>
            <div className="bg-slate-50 h-screen flex items-center justify-center">
                <div className="bg-white h-[450px] w-[400px] rounded-xl shadow-xl p-4">
                    <div className="">
                        <h1 className="text-6xl text-center p-4 font-bold">
                            Registro
                        </h1>
                        <p className="text-center">
                            Ingresa tus datos para crear una cuenta nueva.
                        </p>
                    </div>

                    <div>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        >
                            {({
                                isSubmitting,
                                errors,
                                touched,
                            }) => (
                                <Form>
                                    <Field
                                        type="username"
                                        name="username"
                                        validate={validateUsername}
                                        placeholder="Ingresa tu nombre de usuario"
                                        className={`w-full rounded-md border outline-none p-2 my-2 ${
                                            touched.username &&
                                            errors.username &&
                                            usernameError
                                                ? "border-red-400"
                                                : "border-slate-300"
                                        } ${
                                            usernameError
                                            ? 'text-red-400'
                                            : 'text-green-400'
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <Field
                                        type="email"
                                        name="email"
                                        validate={validateEmail}
                                        placeholder="Ingresa tu email"
                                        className={`w-full rounded-md border outline-none p-2 my-2 ${
                                            touched.email &&
                                            errors.email &&
                                            emailError
                                                ? "border-red-400"
                                                : "border-slate-300"
                                        } ${
                                            emailError
                                            ? 'text-red-400'
                                            : 'text-green-400'
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <Field
                                        type="password"
                                        name="password"
                                        validate={validatePassword}
                                        placeholder="Ingresa una contraseña"
                                        className={`w-full rounded-md border outline-none p-2 my-2 ${
                                            touched.password &&
                                            errors.password &&
                                            passwordError
                                                ? "border-red-400"
                                                : "border-slate-300"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-500 rounded-md text-white px-4 py-3 w-full mt-4"
                                    >
                                        Registrarme
                                    </button>
                                    <ErrorMessage
                                        name="submit"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
