import {useReactTable, getCoreRowModel, flexRender} from '@tanstack/react-table'

const data = [
    {id: 1, name: 'Ada', age: 12},
    {id: 2, name: 'Bat', age: 12},
    {id: 3, name: 'Cat', age: 12},
    {id: 4, name: 'Dog', age: 12},
]
const columns = [
    {accessorKey: 'name', header: 'Name'},
    {accessorKey: 'age', header: 'Age'},
    {accessorKey: 'age', header: 'Age'},
]

export default function Table(props) {
    const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel()})
    return (
        <table className={"w-full text-sm text-left rtl:text-right text-body"}>
            <thead className={"bg-neutral-secondary-soft border-b border-default"}>
            {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                    {hg.headers.map((header) => (
                        <th key={header.id} className={"px-6 py-3 font-medium"}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}
                    className={"odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"}>
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={"px-6 py-4 font-medium text-heading whitespace-nowrap"}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
}