import {Link, useLocation, useNavigate} from "react-router"
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

export default function Pemeriksaan() {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        formState: {errors},
        setFocus
    } = useForm({
        defaultValues: {
            visitDate: new Date(), services: "", height: "", weight: ""
        }
    })

    const navigate = useNavigate()
    const { state } = useLocation()
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

    useEffect(() => {
        setFocus("height")
    }, [setFocus])


    return (<section className="w-full">
        <div className="mx-auto w-full">
            <div
                className="w-full rounded-lg bg-white shadow xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Pemeriksaan Pasien
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="height"
                                   className="mb-2 block text-sm font-medium text-gray-900">Tinggi Badan <span
                                className="text-red-500">*</span></label>

                            <div className="flex w-full rounded-base">
                                <input type="text" id="height" inputMode="numeric"
                                       maxLength={4} {...register("height", {
                                    required: "Tinggi badan wajib diisi", pattern: {
                                        value: DECIMAL_INPUT_REGEX, message: "Format tinggi badan harus 00.0"
                                    }
                                })} onChange={handleDecimalInputChange("height")}
                                       className="grow bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                       placeholder="30.0"/>
                                <span
                                    className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base flex-none">cm</span>
                            </div>
                            {errors.height && <span className="text-sm text-red-500">{errors.height.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="weight"
                                   className="mb-2 block text-sm font-medium text-gray-900">Berat Badan <span
                                className="text-red-500">*</span></label>

                            <div className="flex w-full rounded-base">
                                <input type="text" id="weight" inputMode="numeric"
                                       maxLength={4} {...register("weight", {
                                    required: "Berat badan wajib diisi", pattern: {
                                        value: DECIMAL_INPUT_REGEX, message: "Format berat badan harus 00.0"
                                    }
                                })} onChange={handleDecimalInputChange("weight")}
                                       className="grow bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                       placeholder="14.5"/>
                                <span
                                    className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base flex-none">kg</span>
                            </div>
                            {errors.weight && <span className="text-sm text-red-500">{errors.weight.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="statusGizi"
                                   className="block mb-2 text-sm font-medium text-gray-900">Status Gizi <span
                                className="text-red-500">*</span></label>
                            <div className="relative">
                                <select id="statusGizi"
                                        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                    <option value="baik">Baik</option>
                                    <option value="cukup">Cukup</option>
                                    <option value="kurang">Kurang</option>
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
                        <div>
                            <label htmlFor="keadaanUmum"
                                   className="block mb-2 text-sm font-medium text-gray-900">Keadaan Umum <span
                                className="text-red-500">*</span></label>
                            <div className="relative">
                                <select id="keadaanUmum"
                                        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
                                    <option value="baik">Baik</option>
                                    <option value="cukup">Cukup</option>
                                    <option value="kurang">Kurang</option>
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
                            <label htmlFor="keterangan"
                                   className="block mb-2 text-sm font-medium text-gray-900 ">Keterangan</label>
                            <textarea id="keterangan" rows="8"
                                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                      placeholder="Tambahkan keterangan jika ada"></textarea>
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
