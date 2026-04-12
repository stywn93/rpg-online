import useAuth from "./UseAuth"

function resolveValue(...values) {
    const validValue = values.find((value) => value !== undefined && value !== null && value !== "")
    return validValue ?? "-"
}

function InfoRow({ label, value }) {
    return (
        <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
            <p className="text-sm leading-6 text-slate-700">{value}</p>
        </div>
    )
}

export default function Profile() {
    const auth = useAuth()
    const user = auth?.user ?? {}

    const profile = {
        nama: resolveValue(user.nama, user.name, user.full_name, user.fullName, "Nama Pasien"),
        usia: resolveValue(user.usia, user.age, user.umur, "28 Tahun"),
        jenisKelamin: resolveValue(user.jenis_kelamin, user.jenisKelamin, user.gender, "Laki-laki"),
        golonganDarah: resolveValue(user.golongan_darah, user.golonganDarah, user.blood_type, user.bloodType, "O"),
        alamat: resolveValue(user.alamat, user.address, user.full_address, user.fullAddress, "Jl. Melati No. 18, Jakarta"),
    }

    return (
        <section className="mx-auto rounded-xl bg-white px-6 py-7 sm:px-8 sm:py-9">
            <div className="border-b border-slate-200 pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500">About</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{profile.nama}</h2>
            </div>

            <div className="mt-6 space-y-5">
                <InfoRow label="Nama" value={profile.nama} />
                <InfoRow label="Usia" value={profile.usia} />
                <InfoRow label="Jenis Kelamin" value={profile.jenisKelamin} />
                <InfoRow label="Golongan Darah" value={profile.golonganDarah} />
                <InfoRow label="Alamat" value={profile.alamat} />
            </div>
        </section>
    )
}
