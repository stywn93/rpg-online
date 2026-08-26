import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { Datepicker } from "flowbite-react"

export default function Revisit() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { visitDate: new Date() },
    })
    const [isLoading] = useState(false)

    const onSubmit = async () => {
        // ponytail: stub — wire to POST /visits when needed
    }

    return (
        <section>
            <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Rencana Kunjungan Ulang</h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="visitDate" className="block mb-2 text-sm font-medium text-gray-900">Rencana Kunjungan Ulang</label>
                                <Controller name="visitDate" control={control} rules={{ required: "Tanggal wajib diisi" }} render={({ field }) => (
                                    <Datepicker language="id-ID" minDate={new Date()} selected={field.value} onChange={(date) => field.onChange(date)} />
                                )} />
                                {errors.visitDate && <span className="text-red-500 text-sm">{errors.visitDate.message}</span>}
                            </div>
                            <button type="submit" disabled={isLoading} className="cursor-pointer w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? "Memproses..." : "Simpan"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
