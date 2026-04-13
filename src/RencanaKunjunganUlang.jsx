import {Link, useNavigate} from "react-router"
import {useLocalStorage} from "react-use"
import {Controller, useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState} from "react"
import {Datepicker} from "flowbite-react"
import useAuth from "./UseAuth.js"


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function RencanaKunjunganUlang() {
    const {
        register, control, handleSubmit, formState: {errors},
    } = useForm({
        defaultValues: {
            visitDate: new Date(), services: ""
        }
    })

    const navigate = useNavigate()
    const [token, _] = useLocalStorage("token", "")
    const [isLoading, setIsLoading] = useState(false)
    const [serviceOptions, setServiceOptions] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)
    const {logout} = useAuth()

    const onSubmit = async (data) => {
        const toastId = toast.loading("Memproses...")
        setIsLoading(true)
        await new Promise(requestAnimationFrame)
    }

    return (<section>
        <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
            <div
                className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Buat Rencana Kunjungan
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className={"hidden"}>
                            <label htmlFor="fullname"
                                   className="block mb-2 text-sm font-medium text-gray-900">Nama
                                Pasien</label>
                            <input readOnly type="text" name="fullname" id="fullname"
                                   className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Budi Santoso" required=""/>
                        </div>
                        <div className={"hidden"}>
                            <label htmlFor="gender"
                                   className="block mb-2 text-sm font-medium text-gray-900">Jenis
                                Kelamin</label>
                            <input readOnly type="text" name="gender" id="gender"
                                   className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Laki-laki" required=""/>
                        </div>
                        <div className={"hidden"}>
                            <label htmlFor="age"
                                   className="block mb-2 text-sm font-medium text-gray-900">Usia</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex w-full rounded-base">
                                    <input readOnly type="text" id="ageYear"
                                           className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                           placeholder="3"/>
                                    <span
                                        className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">thn</span>
                                </div>
                                <div className="flex w-full rounded-base">
                                    <input readOnly type="text" id="ageMonth"
                                           className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                           placeholder="10"/>
                                    <span
                                        className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">bln</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="visitDate"
                                   className="block mb-2 text-sm font-medium text-gray-900">
                                Rencana Kunjungan Ulang</label>
                            <Controller name="visitDate" control={control} rules={{required: "Tanggal wajib diisi"}}
                                        render={({field}) => (
                                            <Datepicker language="id-ID" minDate={new Date()} selected={field.value}
                                                        onChange={(date) => {
                                                            field.onChange(date)
                                                            console.log("Tanggal dipilih :", date)
                                                        }}
                                            />)}/>
                            {errors.visitDate &&
                                <span className="text-red-500 text-sm">{errors.visitDate.message}</span>}
                        </div>

                        <button type="submit" disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Memproses..." : "Simpan"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    </section>)
}
