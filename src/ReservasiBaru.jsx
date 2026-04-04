import {Link, useNavigate} from "react-router"
import {listService} from "./lib/api/ServiceTypes.js"
import {useLocalStorage} from "react-use"
import {Controller, useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState} from "react"
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
    const [token, _] = useLocalStorage("token", "")
    const [isLoading, setIsLoading] = useState(false)
    const [serviceOptions, setServiceOptions] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingServices(true)

            try {
                const response = await listService(token)
                const responseBody = await response.json()

                if (!response.ok) {
                    throw new Error(responseBody?.messages?.error || "Gagal memuat daftar layanan.")
                }
                console.log(responseBody)

                const services = Array.isArray(responseBody?.data)
                    ? responseBody.data
                    : Array.isArray(responseBody?.data?.data)
                        ? responseBody.data.data
                        : Array.isArray(responseBody)
                            ? responseBody
                            : []

                setServiceOptions(services)
            } catch (error) {
                toast.error(error.message || "Terjadi kesalahan saat memuat layanan.")
                setServiceOptions([])
            } finally {
                setIsLoadingServices(false)
            }
        }

        if (token) {
            fetchServices()
        }
    }, [token])

    const onSubmit = async (data) => {
        const toastId = toast.loading("Memproses...")
        setIsLoading(true)
        await new Promise(requestAnimationFrame)
        /**
        try {
            const response = await listService(token)
            const responseBody = await response.json()
            // console.log(responseBody)
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
                                    disabled={isLoadingServices}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" {...register("services", {required: true})}>
                                <option value="">Pilih Layanan</option>
                                {serviceOptions.map((service) => (
                                    <option
                                        key={service.id}
                                        value={service.id}
                                    >
                                        {service.deskripsi}
                                    </option>
                                ))}
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
