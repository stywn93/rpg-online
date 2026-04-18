import { Controller, useForm } from "react-hook-form"
import { Datepicker } from "flowbite-react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { patientData } from "./data/patients.js"

export default function UbahPasien() {
    const navigate = useNavigate()
    const { patientId } = useParams()
    const patient = patientData.find((item) => item.id === patientId)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: patient?.name ?? "",
            dob: new Date(),
            age: patient?.age ?? "",
            birthPlace: patient?.birthPlace ?? "",
            parentName: patient?.parentName ?? "",
            bloodType: patient?.bloodType ?? "O",
            address: patient?.address ?? "",
        },
    })

    const onSubmit = async () => {
        toast.success("Perubahan data pasien berhasil disimpan.")
        navigate(`/patients/${patientId}`)
    }

    if (!patient) {
        return (
            <section className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Ubah Data Pasien
                    </h1>
                    <p className="mt-3 text-sm text-slate-500">
                        Data pasien dengan ID {patientId} tidak ditemukan.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Ubah Data Pasien
                            </h1>
                            <p className="text-sm text-slate-500">
                                Perbarui data pasien dengan ID {patient.id}.
                            </p>
                        </div>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-900">
                                    Nama Pasien <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("fullName", { required: "Nama pasien wajib diisi" })}
                                    type="text"
                                    id="fullName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Budi Santoso"
                                />
                                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900">
                                    Tanggal Lahir <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{ required: "Tanggal lahir wajib diisi" }}
                                    render={({ field }) => (
                                        <Datepicker
                                            language="id-ID"
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">
                                    Usia
                                </label>
                                <input
                                    {...register("age")}
                                    type="text"
                                    id="age"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="5 tahun"
                                />
                            </div>

                            <div>
                                <label htmlFor="birthPlace" className="mb-2 block text-sm font-medium text-gray-900">
                                    Tempat Lahir
                                </label>
                                <input
                                    {...register("birthPlace")}
                                    type="text"
                                    id="birthPlace"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Situbondo"
                                />
                            </div>

                            <div>
                                <label htmlFor="parentName" className="mb-2 block text-sm font-medium text-gray-900">
                                    Nama Orang Tua <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("parentName", { required: "Nama orang tua wajib diisi" })}
                                    type="text"
                                    id="parentName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Nama Orang Tua"
                                />
                                {errors.parentName && <span className="text-red-500 text-sm">{errors.parentName.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="bloodType" className="block mb-2 text-sm font-medium text-gray-900">
                                    Golongan Darah
                                </label>
                                <div className="relative">
                                    <select
                                        {...register("bloodType")}
                                        id="bloodType"
                                        className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                                    Alamat <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register("address", { required: "Alamat wajib diisi" })}
                                    id="address"
                                    rows="8"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Alamat pasien"
                                />
                                {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Simpan Perubahan
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Kembali
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
