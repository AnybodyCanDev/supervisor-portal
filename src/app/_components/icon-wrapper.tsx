export default function Icon({ icon, size = '32px', fill=0, className='', spin=false }: {icon: string; size?: string; fill?: number; className?: string; spin?: boolean}) {
    return (     
        <span className={`flex items-center ${spin? 'animate-spin' : ''} material-symbols-rounded ${className}`} style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24`} }>
        {icon}
        </span>
    )
}