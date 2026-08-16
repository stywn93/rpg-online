import {formatIndonesianDate} from "../lib/utils/formatIndonesianDate.js"

function InfoRow({label, value}) {
    return (
        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-400">{label}</p>
            <p className="text-sm leading-6 text-slate-700">{value || "-"}</p>
        </div>
    )
}

function formatGender(genderCode) {
    if (genderCode === "L") {
        return "Laki-laki"
    }
    if (genderCode === "P") {
        return "Perempuan"
    }
    return genderCode || "-"
}

export default function PatientProfile({patient}) {
    if (!patient) {
        return null
    }

    return (
        <section className="w-full">
            <div className="mx-auto w-full">
                <div className="w-full rounded-lg bg-white shadow xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Data Pribadi
                        </h1>

                        <div className="mt-6 space-y-5">
                            <InfoRow label="ID Pasien" value={patient.id}/>
                            <InfoRow label="Nama" value={patient.name}/>
                            <InfoRow label="Tanggal Lahir" value={formatIndonesianDate(patient.dob)}/>
                            <InfoRow label="Usia" value={patient.age}/>
                            <InfoRow label="Jenis Kelamin" value={formatGender(patient.gender_code)}/>
                            <InfoRow label="Orang Tua" value={patient.parent_name}/>
                            <InfoRow label="Email Orang Tua" value={patient.parent_email}/>
                            <InfoRow label="Alamat" value={patient.address}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}