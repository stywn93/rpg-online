import {Link, useNavigate} from "react-router"
import {useLocalStorage} from "react-use"
import {Controller, useForm} from "react-hook-form"
import toast, {Toaster} from 'react-hot-toast'
import {useEffect, useState} from "react"
import {Datepicker} from "flowbite-react"
import useAuth from "./UseAuth.js"


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const DECIMAL_INPUT_REGEX = /^\d{2}\.\d$/

const formatSingleDecimalInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 3)

    if (digits.length <= 2) {
        return digits
    }

    return `${digits.slice(0, 2)}.${digits.slice(2)}`
}

export default function Pendaftaran() {
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
    const [serviceOptions, setServiceOptions] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(false)
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
                        Pendaftaran Pasien
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="fullName"
                                   className="mb-2 block text-sm font-medium text-gray-900">Nama Pasien <span
                                className="text-red-500">*</span></label>
                            <input type="text" name="fullname" id="fullname"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Budi Santoso" required=""/>
                        </div>
                        <div>
                            <label htmlFor="dob"
                                   className="block mb-2 text-sm font-medium text-gray-900">Tanggal
                                Lahir <span
                                    className="text-red-500">*</span></label>
                            <Controller name="dob" control={control} rules={{required: "Tanggal wajib diisi"}}
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
                        <div>
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
                            <label htmlFor="tempatLahir"
                                   className="mb-2 block text-sm font-medium text-gray-900">Tempat Lahir</label>
                            <input type="text" name="tempatLahir" id="tempatLahir"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Situbondo"/>
                        </div>
                        <div>
                            <label htmlFor="parent"
                                   className="mb-2 block text-sm font-medium text-gray-900">Nama Orang Tua <span
                                className="text-red-500">*</span></label>
                            <input type="text" name="parent" id="parent"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                   placeholder="Nama Orang Tua"/>
                        </div>
                        <div>
                            <label htmlFor="golonganDarah"
                                   className="block mb-2 text-sm font-medium text-gray-900">Golongan Darah</label>
                            <div className="relative">
                                <select id="golonganDarah"
                                        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                                <svg
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="alamat"
                                   className="block mb-2 text-sm font-medium text-gray-900 ">Alamat <span
                                className="text-red-500">*</span></label>
                            <textarea id="alamat" rows="8"
                                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                      placeholder="Alamat pasien"></textarea>
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
