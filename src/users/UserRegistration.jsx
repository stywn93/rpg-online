import {Link, useNavigate} from "react-router"
import {useLocalStorage} from "react-use"
import {Controller, useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState} from "react"
import {Datepicker} from "flowbite-react"
import useAuth from "../auth/UseAuth.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const DECIMAL_INPUT_REGEX = /^\d{2}\.\d$/

const formatSingleDecimalInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 3)

    if (digits.length <= 2) {
        return digits
    }

    return `${digits.slice(0, 2)}.${digits.slice(2)}`
}

export default function UserRegistration() {
    const {
        register, control, handleSubmit, setValue, formState: {errors},
    } = useForm({
        defaultValues: {
            visitDate: new Date(), services: "", height: "", weight: ""
        }
    })

    const navigate = useNavigate()
    const [token, _] = useLocalStorage("token", "")
    const [isLoading, setIsLoading] = useState(false)
    // const [serviceOptions, setServiceOptions] = useState([])
    // const [isLoadingServices, setIsLoadingServices] = useState(false)
    const {logout} = useAuth()



    const onSubmit = async (data) => {
        const toastId = toast.loading("Memproses...")
        setIsLoading(true)
        await new Promise(requestAnimationFrame)
    }

    const handleDecimalInputChange = (fieldName) => (event) => {
        setValue(fieldName, formatSingleDecimalInput(event.target.value), {
            shouldDirty: true, shouldTouch: true, shouldValidate: true
        })
    }

    return (<section>
        <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
            <div
                className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Pendaftaran Pengguna
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="fullName"
                                   className="mb-2 block text-sm font-medium text-gray-900">Nama Lengkap <span
                                className="text-red-500">*</span></label>
                            <input type="text" name="fullname" id="fullname"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Budi Santoso" required=""/>
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
                        <div className="sm:col-span-2">
                            <label htmlFor="alamat"
                                   className="block mb-2 text-sm font-medium text-gray-900 ">Alamat <span
                                className="text-red-500">*</span></label>
                            <textarea id="alamat" rows="8"
                                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                      placeholder="Alamat pengguna"></textarea>
                        </div>



                        <button type="submit" disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Memproses..." : "Simpan"}
                        </button>
                        <button type="button" onClick={() => navigate(-1)}
                                className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">Kembali
                        </button>

                    </form>
                </div>
            </div>
        </div>
    </section>)
}
