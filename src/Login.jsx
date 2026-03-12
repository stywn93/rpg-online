import {useState} from "react"
import {Link, useNavigate} from "react-router"
import {userLogin} from "./lib/api/User.js";
import {useLocalStorage} from "react-use";
import {useForm} from "react-hook-form"

export default function Login() {
    const {
        register, handleSubmit, formState: {errors},
    } = useForm()


    // const onSubmit = (e) => console.log(data)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const [_, setToken] = useLocalStorage("token", "")


    const onSubmit = async (e) => {

        const response = await userLogin({
            email: email, password: password,
        });
        const responseBody = await response.json();
        console.log(responseBody);
        if (response.status === 200) {
            //save token ke localStorage
            const token = responseBody.data.token;
            setToken(token);
            // await navigate({
            //     pathname: "/dashboard/contacts"
            // });
            console.log(token);
        } else {
            await alert(responseBody.errors);
        }

    }

    return (<section>
        <borderbg-div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                     alt="logo"/>
                RPG Online
            </a>
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Silahkan masuk ke Akun Anda
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" id="email"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="john@doe.com" value={email} {...register("theEmail", {
                                required: true, pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email regex
                                    message: "Invalid email address"
                                }
                            })} onChange={(e) => setEmail(e.target.value)}/>
                            {errors.theEmail && <span className="text-red-500 text-sm">{errors.theEmail.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required="" value={password} {...register("thePassword", {required: true})}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="flex justify-end">
                            <a href="#"
                               className="text-sm font-medium text-indigo-600 dark:text-indigo-100 hover:underline ">Lupa
                                password?</a>
                        </div>
                        <button type="submit"
                                className="cursor-pointer w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Sign
                            in
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Belum punya akun?
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">Daftar di sini</Link>
                        </p>
                    </form>
                </div>
            </div>
        </borderbg-div>
    </section>)
}
