import React, { useState, useEffect } from 'react';

export default function ListPatients({ refreshTrigger }) {
  const [patients, setPatients] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Traer pacientes. También se ejecuta cuando refreshTrigger cambia
  useEffect(() => {fetchPatients();}, [refreshTrigger]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/listPatients', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const patientsData = data.patients || data;
        
        setPatients(patientsData);
      } else {
        setError('Failed to fetch patients');
      }
    } catch (err) {
      setError('Error fetching patients');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  //Expandir y contraer card del paciente
  const toggleCard = (patientId) => {
    
    setExpandedCards(prev => {
      const newState = {
        ...prev,
        [patientId]: !prev[patientId]
      };
      return newState;
    });

  };

  //Estado de "cargando"
  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-white text-lg">Loading patients...</div>
      </div>
    );

  }

  //Estado de "error"
  if (error) {

    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );

  }

  //Si no hay ningún paciente
  if (patients.length === 0) {

    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-lg">No patients found</div>
      </div>
    );

  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 items-start">
      {patients.map((patient, index) => {
        
        //Todas las cards se expandían cuando se clickeaba una. Guardar la expandida.
        const card = patient.id;
        const isExpanded = expandedCards[card];
        
        return (
          <div
            key={card}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl h-fit ${
              isExpanded ? 'transform scale-105' : ''
            }`}
            onClick={() => {
              toggleCard(card);
            }}
          >
            {/* Card siempre visible */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {patient.full_name}
                </h3>
                <button
                  className={`text-gray-500 hover:text-gray-700 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); //Evita que se expandan todas
                    toggleCard(card);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Foto */}
              <div className="mb-3">
                {patient.photo_path ? (
                  <img
                    src={`/storage/${patient.photo_path}`}
                    alt={`${patient.full_name}'s document`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Parte expandible */}
            <div className={`transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}>

              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="pt-4 space-y-3">

                  {/* Email */}
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">{patient.email}</span>
                  </div>

                  {/* Teléfono */}
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {patient.country_code} {patient.phone_number}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}