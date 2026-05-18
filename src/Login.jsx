import {Link, useNavigate} from "react-router"
import {userLogin} from "./lib/api/User.js"
// import {useLocalStorage} from "react-use"
import {useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState} from "react"
import useAuth from "./auth/UseAuth.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setFocus
    } = useForm()

    const { login, token } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate()
    const logoUrl = import.meta.env.VITE_APP_LOGO_URL

    useEffect(() => {
        if (token) navigate("/", {replace: true})
    }, [token, navigate])


    useEffect(() => {
        setFocus("theEmail")
    }, [setFocus])


    const onSubmit = async (data) => {
        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)
        const toastId = toast.loading("Logging in...")

        // await new Promise(requestAnimationFrame)
        try {
            const response = await userLogin({
                email: data.theEmail,
                password: data.thePassword
            });
            const responseBody = await response.json()
            if (response.status === 200) {
                const {token, expires_in, ...user} = responseBody.data ?? {} //spread variables
                if (!token) {
                    throw new Error("Token tidak ditemukan pada response.")
                }
                if (!user?.id) {
                    throw new Error("Data user tidak ditemukan pada response.")
                }
                login(user, token)
                toast.success("Berhasil Login", {id: toastId})
                await sleep(500)
                navigate("/reservation", {replace: true})
            } else {
                toast.error(responseBody.messages.error, {id: toastId})
            }
        } catch (error) {
            toast.error("Terjadi kesalahan, coba lagi.", {id: toastId})
        } finally {
            setIsSubmitting(false)
        }

    }

    return (<section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img className="w-8 h-8 mr-2" src={logoUrl}
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
                                   placeholder="john@doe.com"
                                   {...register("theEmail", {
                                       required: true, pattern: {
                                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email regex
                                           message: "Invalid email address"
                                       }
                                   })}
                            />
                            {errors.theEmail && <span className="text-red-500 text-sm">{errors.theEmail.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   {...register("thePassword", {required: true})}
                            />
                            {errors.thePassword &&
                                <span className="text-red-500 text-sm">{errors.thePassword.message}</span>}
                        </div>
                        <div className="flex justify-end">
                            <a href="#"
                               className="text-sm font-medium text-indigo-600 dark:text-indigo-100 hover:underline ">Lupa
                                password?</a>
                        </div>
                        <button type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Belum punya akun?
                            <Link to="/register"
                                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"> Daftar
                                di sini</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>)
}
