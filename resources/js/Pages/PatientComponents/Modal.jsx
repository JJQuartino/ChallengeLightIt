export default function Modal({open, onClose, children}){
    return (
        <div
            onClick={onClose}
            className={`fixed inset-0 flex justify-center items-center transition-colors
            ${ open ? "visible bg-black/20" : "invisible"}`
            }

        >
        <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl p-6 transition-all
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} w-[400px] max-w-full`
            }
        >
            {children}
        </div>
        </div>
    );
}