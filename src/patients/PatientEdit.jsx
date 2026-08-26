import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLocalStorage } from "react-use"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Datepicker } from "flowbite-react"
import toast from "react-hot-toast"
import useAuth from "../auth/UseAuth.js"
import { getPatientDetail, updatePatient } from "../lib/api/Patient.js"
import { normalizePatientDetail } from "../lib/utils/Normalization.js"
import { formatDateForApi, calculateAgeParts, inputClassName } from "../lib/utils/date.js"

export default function PatientEdit() {
    const navigate = useNavigate()
    const { patientId } = useParams()
    const [token] = useLocalStorage("token", "")
    const { logout } = useAuth()

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: "", dob: null, gender_code: "", address: "" },
    })

    const [isFetching, setIsFetching] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const selectedDob = useWatch({ control, name: "dob" })
    const ageParts = calculateAgeParts(selectedDob)

    useEffect(() => {
        if (!token || !patientId) return
        let cancelled = false
        async function fetchDetail() {
            setIsFetching(true)
            setNotFound(false)
            try {
                const response = await getPatientDetail(token, patientId)
                const body = await response.json()
                if (response.status === 401) { logout(); return }
                if (response.status !== 200 || body?.status === "error") {
                    if (!cancelled) setNotFound(true)
                    return
                }
                const patient = normalizePatientDetail(body)
                if (!patient) { if (!cancelled) setNotFound(true); return }
                if (!cancelled) {
                    const dobDate = patient.dob ? new Date(patient.dob) : null
                    const validDob = dobDate && !Number.isNaN(dobDate.getTime()) ? dobDate : null
                    reset({
                        name: patient.name ?? "",
                        dob: validDob,
                        gender_code: patient.gender_code ?? "",
                        address: patient.address ?? "",
                    })
                }
            } catch {
                if (!cancelled) setNotFound(true)
            } finally {
                if (!cancelled) setIsFetching(false)
            }
        }
        fetchDetail()
        return () => { cancelled = true }
    }, [token, patientId, logout, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const toastId = toast.loading("Menyimpan...")
        try {
            const response = await updatePatient(token, patientId, {
                name: data.name,
                dob: formatDateForApi(data.dob),
                gender_code: data.gender_code,
                address: data.address,
            })
            const body = await response.json()
            if (response.status === 401) { logout(); return }
            if (body?.status !== "success" && response.status !== 200) {
                throw new Error(body?.message ?? "Gagal menyimpan perubahan.")
            }
            toast.success("Perubahan data pasien berhasil disimpan.", { id: toastId })
            navigate(`/patients/${patientId}`)
        } catch (error) {
            toast.error(error.message, { id: toastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isFetching) {
        return (
            <section className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-500">Memuat data pasien...</p>
                </div>
            </section>
        )
    }

    if (notFound) {
        return (
            <section className="space-y-5">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Ubah Data Pasien</h1>
                    <p className="mt-3 text-sm text-slate-500">Data pasien dengan ID {patientId} tidak ditemukan.</p>
                    <button type="button" onClick={() => navigate(-1)} className="mt-4 cursor-pointer rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-800">Kembali</button>
                </div>
            </section>
        )
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Ubah Data Pasien</h1>
                            <p className="text-sm text-slate-500">Perbarui data pasien dengan ID {patientId}.</p>
                        </div>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">Nama Pasien <span className="text-red-500">*</span></label>
                                <input id="name" type="text" className={inputClassName} placeholder="Budi Santoso" {...register("name", { required: "Nama wajib diisi", minLength: { value: 3, message: "Nama minimal 3 karakter" } })} />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900">Tanggal Lahir <span className="text-red-500">*</span></label>
                                <Controller name="dob" control={control} rules={{ required: "Tanggal wajib diisi" }} render={({ field }) => (
                                    <Datepicker language="id-ID" maxDate={new Date()} selected={field.value} onChange={(date) => field.onChange(date)} />
                                )} />
                                {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Usia</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex w-full">
                                        <input readOnly type="text" value={ageParts.years} className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm" placeholder="3" />
                                        <span className="inline-flex items-center px-3 text-sm bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg">thn</span>
                                    </div>
                                    <div className="flex w-full">
                                        <input readOnly type="text" value={ageParts.months} className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm" placeholder="10" />
                                        <span className="inline-flex items-center px-3 text-sm bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg">bln</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gender_code" className="mb-2 block text-sm font-medium text-gray-900">Jenis Kelamin <span className="text-red-500">*</span></label>
                                <select id="gender_code" className={`${inputClassName} appearance-none`} {...register("gender_code", { required: "Jenis kelamin wajib diisi" })}>
                                    <option value="">Pilih jenis kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.gender_code && <span className="text-red-500 text-sm">{errors.gender_code.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Alamat <span className="text-red-500">*</span></label>
                                <textarea id="address" rows="4" className={`${inputClassName} resize-none`} placeholder="Alamat pasien" {...register("address", { required: "Alamat wajib diisi", minLength: { value: 5, message: "Alamat minimal 5 karakter" } })} />
                                {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                            </div>

                            <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                            <button type="button" onClick={() => navigate(-1)} className="cursor-pointer w-full text-white bg-rose-600 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Kembali
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
