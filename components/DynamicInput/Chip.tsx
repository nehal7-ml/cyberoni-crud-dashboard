import { Edit, X } from "lucide-react";

function Chip({
    label,
    onEdit,
    onDelete
}: {
    label: string;
    onEdit: () => void;
    onDelete: () => void;

}) {

    console.log("object-chip", label);
    return (
        <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-300 text-white p-3 rounded-xl">
            <div className="max-w-xs text-ellipsis overflow-clip line-clamp-2">{label}</div>
            <button type="button" onClick={onEdit} className="flex ">
                <Edit />
            </button>
            <button type="button" onClick={onDelete} className="flex hover:text-red">
                <X />
            </button>
        </div>
    );
}

export default Chip;
