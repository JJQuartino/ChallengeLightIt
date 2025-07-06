export default function StatusModal({ open, onClose, status, message, children }) {
  const isSuccess = status === "Success";
  const isError = status === "Oops";
  
  const getStatus = () => {
    if (isSuccess)
    {
      return {
        iconColor: "text-green-600",
        titleColor: "text-green-800",
        borderColor: "border-green-200",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
    else if (isError)
    {
      return {
        iconColor: "text-red-600",
        titleColor: "text-red-800",
        borderColor: "border-red-200",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
    
  };

  const config = getStatus();
  if (!config) return null; //Para no renderizar nada si no hay éxito o falla
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors z-50
        ${open ? "visible bg-black/20" : "invisible"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl p-6 transition-all border-2 ${config.borderColor}
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"} w-[400px] max-w-full`}
      >
        {/* Header with icon and status */}
        <div className={`rounded-lg p-4 mb-4`}>
          <div className="flex flex-col items-center text-center">
            <div className={`${config.iconColor} mb-2`}>
              {config.icon}
            </div>
            <h3 className={`text-xl font-semibold ${config.titleColor}`}>
              {status}
            </h3>
          </div>
        </div>

        {message && (
          <div className="mb-4 text-center">
            <p className="text-gray-700">{message}</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors
              ${isSuccess 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : isError 
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}