import {Link, useNavigate} from "react-router"
import {userLogin} from "./lib/api/User.js"
import {useLocalStorage} from "react-use"
import {Controller, useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useState} from "react"
import {Datepicker} from "flowbite-react"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ReservasiBaru() {
    const {
        register, control, handleSubmit, formState: {errors},
    } = useForm({
        defaultValues: {
            visitDate: new Date(),
            services: ""
        }
    })


    const navigate = useNavigate()
    const [_, setToken] = useLocalStorage("token", "")
    const [isLoading, setIsLoading] = useState(false)


    const onSubmit = async (data) => {
        const toastId = toast.loading("Logging in...")
        setIsLoading(true)
        console.log(data)
        // await new Promise(requestAnimationFrame)
        /**
         try {
         const response = await userLogin({
         email: data.theEmail,
         password: data.thePassword
         });
         const responseBody = await response.json()
         console.log(responseBody)
         if (response.status === 200) {
         const token = responseBody.data.token
         setToken(token)
         toast.success("Logged in successfully", {id: toastId})
         await sleep(500)
         navigate("/")
         } else {
         toast.error(responseBody.messages.error, {id: toastId})
         }
         } catch (error) {
         toast.error("Terjadi kesalahan, coba lagi.", {id: toastId})
         } finally {
         setIsLoading(false)
         }
         */

    }

    return (<section>
        <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">

            <div>
                <Toaster/>
            </div>
            <div
                className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Buat Rencana Kunjungan
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="visitDate"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tanggal
                                Rencana Berkunjung</label>
                            <Controller name="visitDate" control={control} rules={{required: "Tanggal wajib diisi"}}
                                        render={({field}) => (
                                            <Datepicker language="id-ID" minDate={new Date()} selected={field.value}
                                                        onChange={(date) => {
                                                            field.onChange(date)
                                                            console.log("Tanggal dipilih :", date)
                                                        }}
                                            />
                                        )}/>
                            {errors.visitDate &&
                                <span className="text-red-500 text-sm">{errors.visitDate.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="services"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis
                                Layanan</label>
                            <select id="services"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" {...register("services", {required: true})}>
                                <option value="">Pilih Layanan</option>
                                <option value="AP">Akupuntur</option>
                                <option value="AK">Akupressure</option>
                                <option value="FR">Fisioterapi</option>
                            </select>
                            {errors.services &&
                                <span className="text-red-500 text-sm">{errors.services.message}</span>}

                        </div>


                        <button type="submit" disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Memproses..." : "Simpan"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    </section>)
}
