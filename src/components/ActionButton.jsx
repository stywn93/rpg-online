import {Link} from "react-router-dom"

const VARIANTS = {
    primary: "bg-blue-600 text-white hover:bg-blue-800 cursor-pointer",
    accent: "bg-fuchsia-600 text-white hover:bg-fuchsia-800 cursor-pointer",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
    success: "bg-green-600 text-white hover:bg-green-800 cursor-pointer dark:bg-green-100 dark:text-slate-900 dark:hover:bg-green-200",
    danger: "bg-red-600 text-white hover:bg-red-800 cursor-pointer",
}

export default function ActionButton({
    children,
    variant = "primary",
    onClick,
    to,
    disabled = false,
    className = "",
}) {
    const classes = `inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition ${VARIANTS[variant]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()

    if (to) {
        return (
            <Link to={to} className={classes}>
                {children}
            </Link>
        )
    }

    return (
        <button type="button" onClick={onClick} disabled={disabled} className={classes}>
            {children}
        </button>
    )
}