import {Controller} from "react-hook-form"
import {Datepicker} from "flowbite-react"
import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

function parseAgeParts(ageValue) {
    const fallback = {years: "-", months: "-"}

    if (typeof ageValue !== "string") {
        return fallback
    }

    const yearsMatch = ageValue.match(/(\d+)\s*(tahun|thn)/i)
    const monthsMatch = ageValue.match(/(\d+)\s*(bulan|bln)/i)

    return {
        years: yearsMatch?.[1] ?? fallback.years,
        months: monthsMatch?.[1] ?? fallback.months,
    }
}

function getGenderLabel(genderCode) {
    if (genderCode === "L") {
        return "Laki-laki"
    }

    if (genderCode === "P") {
        return "Perempuan"
    }

    return ""
}

export default function ReservationForm({
    control,
    errors,
    onSubmit,
    isLoading,
    selectedPatient,
    lastVisitDate,
    isLoadingPatientData,
    patientSearchTerm,
    isSingleChildUser,
    isAdmin,
    isPatientDropdownOpen,
    onPatientSearchChange,
    onPatientSearchKeyDown,
    onPatientFocus,
    onSelectPatient,
    isLoadingPatients,
    visiblePatientOptions,
}) {
    const ageParts = parseAgeParts(selectedPatient?.age)

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Buat Rencana Kunjungan
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                            <div className="relative">
                                <label htmlFor="patient-search" className="block mb-2 text-sm font-medium text-gray-900">
                                    Nama Pasien
                                </label>
                                <input
                                    type="text"
                                    id="patient-search"
                                    value={patientSearchTerm}
                                    onChange={onPatientSearchChange}
                                    onKeyDown={onPatientSearchKeyDown}
                                    onFocus={onPatientFocus}
                                    readOnly={isSingleChildUser}
                                    autoComplete="off"
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder={
                                        isSingleChildUser
                                            ? "Patients otomatis dipilih"
                                            : isAdmin
                                                ? "Spasi 3x atau Ketik nama pasien"
                                                : "Ketik nama anak"
                                    }
                                />

                                {!isSingleChildUser && isPatientDropdownOpen && (
                                    <div className="absolute left-0 right-0 z-10 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                        <div className="max-h-60 overflow-y-auto">
                                            {isLoadingPatients && (
                                                <p className="px-3 py-2 text-sm text-slate-500">Memuat pasien...</p>
                                            )}

                                            {!isLoadingPatients && visiblePatientOptions.length === 0 && (
                                                <p className="px-3 py-2 text-sm text-slate-500">Pasien tidak ditemukan.</p>
                                            )}

                                            {!isLoadingPatients && visiblePatientOptions.map((patient) => (
                                                <button
                                                    key={patient.id}
                                                    type="button"
                                                    onClick={() => onSelectPatient(patient)}
                                                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span className="block font-medium text-slate-900">{patient.name}</span>
                                                    <span className="block text-xs text-slate-500">
                                                        {patient.age ?? "-"} • {patient.gender_code === "L" ? "Laki-laki" : "Perempuan"}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
                                    Jenis Kelamin
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="gender"
                                    value={getGenderLabel(selectedPatient?.gender_code)}
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Jenis kelamin"
                                />
                            </div>

                            <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900">
                                    Usia
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex w-full rounded-base">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageYear"
                                            value={ageParts.years}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                            placeholder="0"
                                        />
                                        <span className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">
                                            thn
                                        </span>
                                    </div>
                                    <div className="flex w-full rounded-base">
                                        <input
                                            readOnly
                                            type="text"
                                            id="ageMonth"
                                            value={ageParts.months}
                                            className="read-only:cursor-not-allowed w-full bg-gray-50 border-gray-300 rounded-none rounded-s-base px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm focus:ring-brand focus:border-brand placeholder:text-body"
                                            placeholder="0"
                                        />
                                        <span className="bg-gray-50 border-gray-300 inline-flex items-center px-3 text-sm text-body bg-neutral-tertiary border rounded-e-0 border-default-medium rounded-e-base">
                                            bln
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="lastVisit" className="block mb-2 text-sm font-medium text-gray-900">
                                    Kunjungan Terakhir
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="lastVisit"
                                    value={
                                        isLoadingPatientData
                                            ? "Memuat riwayat kunjungan..."
                                            : lastVisitDate
                                                ? formatIndonesianDate(lastVisitDate)
                                                : selectedPatient?.id
                                                    ? "Belum ada riwayat kunjungan"
                                                    : ""
                                    }
                                    className="read-only:cursor-not-allowed bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Riwayat kunjungan terakhir"
                                />
                            </div>

                            <div>
                                <label htmlFor="visitDate" className="block mb-2 text-sm font-medium text-gray-900">
                                    Tanggal Rencana Berkunjung
                                </label>
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    rules={{required: "Tanggal wajib diisi"}}
                                    render={({field}) => (
                                        <Datepicker
                                            language="id-ID"
                                            minDate={new Date()}
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            autoComplete="off"
                                        />
                                    )}
                                />
                                {errors.visitDate && (
                                    <span className="text-red-500 text-sm">{errors.visitDate.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Simpan"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}