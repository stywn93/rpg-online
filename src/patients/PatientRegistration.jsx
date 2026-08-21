import {useNavigate} from "react-router"
import {useLocalStorage} from "react-use"
import {Controller, useForm, useWatch} from "react-hook-form"
import toast from "react-hot-toast"
import {useState} from "react"
import {Datepicker} from "flowbite-react"
import useAuth from "../auth/UseAuth.js"
import useParentOptions from "../lib/hooks/useParentOptions.js"
import {createPatient} from "../lib/api/Patient.js"
import {isStaffRole} from "../lib/utils/roles.js"

function formatDateForApi(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return ""
    }

    const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000)

    return localDate.toISOString().split("T")[0]
}

const calculateAgeParts = (dob) => {
    if (!(dob instanceof Date) || Number.isNaN(dob.getTime())) {
        return {years: "", months: ""}
    }

    const today = new Date()
    let years = today.getFullYear() - dob.getFullYear()
    let months = today.getMonth() - dob.getMonth()

    if (today.getDate() < dob.getDate()) {
        months -= 1
    }

    if (months < 0) {
        years -= 1
        months += 12
    }

    if (years < 0) {
        return {years: "", months: ""}
    }

    return {
        years: String(years),
        months: String(months),
    }
}

const inputClassName = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"

export default function PatientRegistration() {
    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            name: "",
            dob: null,
            gender_code: "",
            address: "",
        },
    })

    const navigate = useNavigate()
    const [token] = useLocalStorage("token", "")
    const {logout, user} = useAuth()

    const isStaff = isStaffRole(user?.role)

    const [isLoading, setIsLoading] = useState(false)
    const [selectedParent, setSelectedParent] = useState(null)
    const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false)

    const {parents, isLoading: isLoadingParents, searchTerm, setSearchTerm} = useParentOptions({token, logout, enabled: isStaff})

    const selectedDob = useWatch({control, name: "dob"})
    const ageParts = calculateAgeParts(selectedDob)

    const handleSelectParent = (parent) => {
        setSelectedParent(parent)
        setIsParentDropdownOpen(false)
    }

    const handleClearParent = () => {
        setSelectedParent(null)
        setSearchTerm("")
    }

    const onSubmit = async (data) => {
        const parentUserId = isStaff ? (selectedParent ? Number(selectedParent.id) : null) : Number(user?.id ?? 0)

        if (isStaff && !selectedParent) {
            toast.error("Silakan pilih orang tua terlebih dahulu.")
            return
        }

        if (!parentUserId) {
            toast.error("Data orang tua tidak valid.")
            return
        }

        setIsLoading(true)
        const toastId = toast.loading("Memproses...")

        try {
            const response = await createPatient(token, {
                name: data.name,
                dob: formatDateForApi(data.dob),
                user_id: parentUserId,
                address: data.address,
                gender_code: data.gender_code,
            })
            const body = await response.json()

            if (response.status === 401) {
                logout()
                return
            }
            if (body?.status !== "success") {
                throw new Error(body?.message ?? "Gagal menyimpan pasien.")
            }

            toast.success("Pasien berhasil didaftarkan.", {id: toastId})
            navigate("/patients")
        } catch (error) {
            toast.error(error.message, {id: toastId})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Pendaftaran Pasien
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-900">
                                    Nama Pasien <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    className={inputClassName}
                                    placeholder="Budi Santoso"
                                    {...register("name", {required: "Nama wajib diisi", minLength: {value: 3, message: "Nama minimal 3 karakter"}})}
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="parent" className="mb-2 block text-sm font-medium text-gray-900">
                                    Nama Orang Tua <span className="text-red-500">*</span>
                                </label>
                                {isStaff ? (
                                    <>
                                        <div className="relative">
                                            <input
                                                id="parent"
                                                type="text"
                                                className={inputClassName}
                                                placeholder="Ketik nama orang tua untuk mencari"
                                                value={selectedParent ? selectedParent.name : searchTerm}
                                                onChange={(event) => {
                                                    handleClearParent()
                                                    setSearchTerm(event.target.value)
                                                    setIsParentDropdownOpen(true)
                                                }}
                                                onFocus={() => setIsParentDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsParentDropdownOpen(false), 150)}
                                            />
                                            {isParentDropdownOpen && (
                                                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                                                    {parents.map((parent) => (
                                                        <li key={parent.id}>
                                                            <button
                                                                type="button"
                                                                onMouseDown={(event) => {
                                                                    event.preventDefault()
                                                                    handleSelectParent(parent)
                                                                }}
                                                                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            >
                                                                <span className="block font-medium text-slate-900 dark:text-slate-100">{parent.name}</span>
                                                                <span className="block text-xs text-slate-500 dark:text-slate-400">{parent.email}</span>
                                                            </button>
                                                        </li>
                                                    ))}
                                                    {isLoadingParents && (
                                                        <li className="px-3 py-2 text-sm text-slate-500">Memuat...</li>
                                                    )}
                                                    {!isLoadingParents && parents.length === 0 && (
                                                        <li className="px-3 py-2 text-sm text-slate-500">Tidak ada orang tua ditemukan.</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                        {selectedParent && (
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Orang tua terpilih: {selectedParent.name} ({selectedParent.email})
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <input
                                        id="parent"
                                        type="text"
                                        className={`${inputClassName} cursor-not-allowed opacity-70`}
                                        value={user?.name ?? "-"}
                                        readOnly
                                    />
                                )}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900">
                                    Tanggal Lahir <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="dob"
                                    control={control}
                                    rules={{required: "Tanggal wajib diisi"}}
                                    render={({field}) => (
                                        <Datepicker
                                            language="id-ID"
                                            maxDate={new Date()}
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">Usia</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex w-full">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageYear"
                                            value={ageParts.years}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm"
                                            placeholder="3"
                                        />
                                        <span className="inline-flex items-center px-3 text-sm bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg">thn</span>
                                    </div>
                                    <div className="flex w-full">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageMonth"
                                            value={ageParts.months}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm"
                                            placeholder="10"
                                        />
                                        <span className="inline-flex items-center px-3 text-sm bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg">bln</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="genderCode" className="mb-2 block text-sm font-medium text-gray-900">
                                    Jenis Kelamin <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="genderCode"
                                    className={`${inputClassName} appearance-none`}
                                    {...register("gender_code", {required: "Jenis kelamin wajib diisi"})}
                                >
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.gender_code && <span className="text-red-500 text-sm">{errors.gender_code.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">
                                    Alamat <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="address"
                                    rows="4"
                                    className={`${inputClassName} resize-none`}
                                    placeholder="Alamat pasien"
                                    {...register("address", {required: "Alamat wajib diisi", minLength: {value: 5, message: "Alamat minimal 5 karakter"}})}
                                />
                                {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Simpan"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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