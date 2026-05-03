import { apiBaseUrl } from "./baseUrl"

export const insertAssesment = async (token, data) => {
    return await fetch(`${apiBaseUrl}/growthrecords`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            patient_id:data.patient_id,berat_badan:data.weight, tinggi_badan:data.height, status_gizi:data.nutrition_status, keadaan_umum:data.condition, tanggal_pemeriksaan:data.visitDate, keterangan:data.remark
        })
    })
}

export const listAssesment = async (token, id) => {
    return await fetch(`${apiBaseUrl}/growthrecords/patient/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
}
