import {Link, useNavigate} from "react-router-dom"
import {userRegister} from "./lib/api/User.js"
import {useLocalStorage} from "react-use"
import {useForm} from "react-hook-form"
import toast from 'react-hot-toast';
import {useState} from "react";
import logoUrl from "./favicon.png"


export default function Register({withinDashboard = false}) {
    const {
        register, handleSubmit, watch, formState: {errors},
    } = useForm()
    const password = watch("thePassword")


    const navigate = useNavigate()
    const [_, setToken] = useLocalStorage("token", "")
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (data) => {
        const toastId = toast.loading("Signing up...")
        setIsLoading(true)
        try {
            const response = await userRegister({
                name: data.fullName,
                email: data.theEmail,
                phone: data.phone,
                password: data.thePassword
            });
            const responseBody = await response.json().catch(() => null)

            if (response.status == 200) {
                toast.success(withinDashboard ? "Pengguna berhasil dibuat" : "Signed up successfully", {id: toastId})
                navigate(withinDashboard ? "/users" : "/")
            } else {
                const message =
                    responseBody?.message ??
                    responseBody?.messages?.error ??
                    responseBody?.error ??
                    "Gagal mendaftar. Coba lagi."
                toast.error(message, {id: toastId})
            }
        } catch (error) {
            toast.error(`Terjadi kesalahan, coba lagi. ${error}`, {id: toastId})
        } finally {
            setIsLoading(false)
        }

    }

    return (<section>
        <div
            className={`flex flex-col items-center px-6 mx-auto ${withinDashboard ? "py-2 lg:py-0" : "justify-center py-8 md:h-screen lg:py-0"}`}>
            {!withinDashboard && (
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2 rounded" src={logoUrl}
                         alt="logo"/>
                    RPG Online
                </a>
            )}
            <div
                className={`w-full bg-white rounded-lg shadow ${withinDashboard ? "sm:max-w-2xl" : "dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"}`}>
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        {withinDashboard ? "Buat Pengguna Baru" : "Buat Akun Baru"}
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="fullName"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Lengkap</label>
                            <input type="text" name="fullName" id="fullName"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Budi Santoso"
                                   {...register("fullName", {
                                       required: true,
                                       pattern: {
                                           value: /^[A-Za-z\s.'-]{1,150}$/,
                                           message: "Nama Lengkap Tidak Valid"
                                       }
                                   })}
                            />
                            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" id="email"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="john@doe.com"
                                   {...register("theEmail", {
                                       required: true, pattern: {
                                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email regex
                                           message: "Alamat Email Tidak Valid"
                                       }
                                   })}
                            />
                            {errors.theEmail && <span className="text-red-500 text-sm">{errors.theEmail.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="phone"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Telepon</label>
                            <input type="text" name="phone" id="phone"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="+62..."
                                   {...register("phone", {
                                       required: true, pattern: {
                                           value: /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
                                           message: "Nomor telepon tidak valid"
                                       }
                                   })}
                            />
                            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   {...register("thePassword", {required: true,
                                       minLength: {
                                           value: 6,
                                           message: "Password minimal 6 karakter"
                                       }})}
                            />
                            {errors.thePassword &&
                                <span className="text-red-500 text-sm">{errors.thePassword.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi Password</label>
                            <input type="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   {...register("confirmPassword", {required: true, validate: (value) => value === password || "Password tidak sama"})}
                            />
                            {errors.confirmPassword &&
                                <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                        </div>
                        <button type="submit" disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Signing up..." : "Sign up"}
                        </button>
                        {withinDashboard ? (
                            <button
                                type="button"
                                onClick={() => navigate("/users")}
                                className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Kembali
                            </button>
                        ) : (
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Sudah punya akun?
                                <Link to="/"
                                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"> Masuk
                                    di sini</Link>
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    </section>)
}
