import React, { useState } from 'react';
import CreatePatient from './PatientComponents/CreatePatient';
import ListPatients from './PatientComponents/ListPatients';

export default function PatientsView() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //Callback que se llama cada vez que se añade un paciente
  const handlePatientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <CreatePatient onPatientAdded={handlePatientAdded} />
      <ListPatients refreshTrigger={refreshTrigger} />
    </div>
  );
}