import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";

const Login = () => {
    let emailError = false;
    let passwordError = false;

    const initialValues = {
        email: "",
        password: ""
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
        } else {
            passwordError = false;
        }
        return error;
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            email: values.email,
            password: values.password
        };

        const config = {
            method: "post",
            url: "http://localhost:3000/api/v1/login",
            headers: {
                "Content-Type": "application/json"
            },
            data
        };

        const response = await axios(config);

        console.log(response.data);

        if (response.status === 200) {
            console.log();
        }

        setSubmitting(false);
    }

    return (
        <>
            <div className="bg-slate-50 h-screen flex items-center justify-center">
                <div className="bg-white h-[400px] w-[400px] rounded-xl shadow-xl p-4">
                    <div className="">
                        <h1 className="text-6xl text-center p-4 font-bold">
                            ¡Bienvenido!
                        </h1>
                    </div>

                    <div>
                        <div>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
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
                                            placeholder="Ingresa tu contraseña"
                                            className={`w-full rounded-md border outline-none p-2 my-2 ${
                                                touched.password &&
                                                errors.password &&
                                                passwordError
                                                    ? "border-red-400"
                                                    : "border-slate-300"
                                            } ${
                                                passwordError
                                                ? 'text-red-400'
                                                : 'text-green-400'
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
                                            className="bg-green-500 rounded-md text-white py-3 mt-2 w-full text-xl"
                                        >
                                            Iniciar Sesión
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        <div className="">
                            <p className="text-center my-2 text-sm">
                                ¿Aún no tienes cuenta?{" "}
                                <a href="/signup" className="text-blue-500">
                                    Regístrate
                                </a>
                            </p>
                            {/* <p className="text-center my-2 text-sm">
                                ¿Olvidaste tu contraseña?{" "}
                                <a
                                    href="/forgotpassword"
                                    className="text-blue-500"
                                >
                                    Recuperar contraseña
                                </a>
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
