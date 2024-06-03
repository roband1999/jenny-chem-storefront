import lbarrow from "../../assets/foundational/light_blue_filled_arrow_right.svg"
import wbarrow from "../../assets/foundational/white_arrow_right.svg"

interface ArrowButtonProps {
    label: string;
    onClick: () => void;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange

export function ArrowButton({ label, onClick }: ArrowButtonProps) {
    return (
        <button onClick={onClick} className="bg-jc-dark-blue py-1 px-1  rounded-full border border-jc-light-blue drop-shadow">
            <div className="flex flex-row justify-between">
                <p className="px-2 line-clamp-1 text-base" style={{ color: '#fff' }}>{label}</p>
                <img alt="arrow" src={lbarrow} />
            </div>
        </button >
    )
}

export function LightBlueArrowButton({ label, onClick }: ArrowButtonProps) {
    return (
        <button onClick={onClick} className="py-1 px-1 bg-jc-light-blue rounded-full border border-white drop-shadow">
            <div className="flex flex-row justify-between">
                <p className="px-2 line-clamp-1 text-base" style={{ color: '#fff' }}>{label}</p>
                <img alt="arrow" src={wbarrow} />
            </div>
        </button >
    )
}