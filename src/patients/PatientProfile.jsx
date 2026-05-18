import useAuth from "../auth/UseAuth.js"

function InfoRow({label, value}) {
    return (
        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-400">{label}</p>
            <p className="text-sm leading-6 text-slate-700">{value}</p>
        </div>
    )
}

export default function PatientProfile({patient}) {

    // const auth = useAuth()
    // const user = auth?.user ?? {}

    return (
        <section className="w-full">
            <div className="mx-auto w-full">
                <div className="w-full rounded-lg bg-white shadow xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Data Pribadi
                        </h1>


                        <div className="mt-6 space-y-5">
                            <InfoRow label="Nama" value={patient.nama_lengkap ?? patient.nama} />
                            <InfoRow label="Usia" value={patient.usia}/>
                            <InfoRow label="Jenis Kelamin" value={patient.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}/>
                            <InfoRow label="Orang Tua" value={patient.nama_orang_tua ?? patient.parent_name}/>
                            <InfoRow label="Alamat" value={patient.alamat}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
