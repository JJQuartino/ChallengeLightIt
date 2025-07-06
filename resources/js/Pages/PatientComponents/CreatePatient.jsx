import React, { useState } from 'react';
import Modal from './Modal';
import StatusModal from './StatusModal'; // Import the new StatusModal
import TextInput from '../../Components/TextInput';
import InputLabel from '../../Components/InputLabel';
import DragNdrop from './DragNDrop';

export default function CreatePatient({ onPatientAdded }) {

  //Estados
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({full_name: '', email: '', country_code: '', phone_number: ''});
  
  // Estados para el StatusModal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalStatus, setStatusModalStatus] = useState('');
  const [statusModalMessage, setStatusModalMessage] = useState('');

  const addPatient = (patient) => {setPatients([...patients, patient]);};

  //Maneja los cambios en los inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    //Limpia los errores cuando se vuelve a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  //Para mostrar la modal de éxito/falla
  const showStatusModal = (status, message) => {
    setStatusModalStatus(status);
    setStatusModalMessage(message);
    setStatusModalOpen(true);
  };

  //Se ocupa de enviar el form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      //Validación
      const newErrors = {};
      
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!formData.email.endsWith('@gmail.com')) {
        newErrors.email = 'Email must be a Gmail address (@gmail.com)';
      }
      
      if (!formData.country_code.trim()) {
        newErrors.country_code = 'Country code is required';
      }
      
      if (!formData.phone_number.trim()) {
        newErrors.phone_number = 'Phone number is required';
      }
      
      if (files.length === 0) {
        newErrors.document_photo = 'Document photo is required';
      }

      if (Object.keys(newErrors).length > 0) { //Hubo errores? Mostrarlos
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      //Creamos un objeto FormData para guardar los datos
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('country_code', formData.country_code);
      submitData.append('phone_number', formData.phone_number);
      
      //Agregamos el primer archivo
      if (files.length > 0) {
        submitData.append('document_photo', files[0]);
      }

      //Llamada al backend para crear el paciente
      const response = await fetch('/createPatient', {
        method: 'POST',
        body: submitData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        //Paciente añadido con éxito, se agrega a la lista y se cierra la modal
        addPatient(result.patient || result);
        
        //Resetear campos de la modal, archivos y cerrarla
        setFormData({full_name: '', email: '', country_code: '',phone_number: ''});
        setFiles([]);
        setOpen(false);
        
        //Mostrar modal de éxito
        showStatusModal('Success', 'Patient created successfully!');
        
        //Dispara la recarga de la lista
        if (onPatientAdded) {
          onPatientAdded();
        }
      } else {
        //Mostrar errores del back
        if (result.errors) {
          setErrors(result.errors);
        } else {
          // Mostrar modal de error
          showStatusModal('Oops', result.message || 'Unknown error occurred');
        }
      }
    }
    catch (error)
    {
      console.error('Error submitting form:', error);
      // Mostrar modal de error
      showStatusModal('Oops', 'Error creating patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //Resetear modal al cerrarla
  const handleModalClose = () => {
    setOpen(false);
    setFormData({
      full_name: '',
      email: '',
      country_code: '',
      phone_number: ''
    });
    setFiles([]);
    setErrors({});
  };

  return (
    <div className="bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Patients</h1>
          <button 
            onClick={() => setOpen(true)} 
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Add Patient</span>
          </button>

          <Modal open={open} onClose={handleModalClose}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <InputLabel value={"Patient Name"} />
                <TextInput 
                  className="w-full" 
                  placeholder="Full Name" 
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              <div className="mb-4">
                <InputLabel value={"Email"} />
                <TextInput 
                  type="email" 
                  className="w-full" 
                  placeholder="name@gmail.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <div className="w-1/4">
                  <InputLabel value="Prefix" />
                  <TextInput 
                    className="w-full" 
                    placeholder="+123" 
                    value={formData.country_code}
                    onChange={(e) => handleInputChange('country_code', e.target.value)}
                  />
                  {errors.country_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.country_code}</p>
                  )}
                </div>

                <div className="w-3/4">
                  <InputLabel value="Phone number" />
                  <TextInput 
                    className="w-full" 
                    placeholder="123456789" 
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <DragNdrop onFilesSelected={setFiles} />
                {errors.document_photo && (
                  <p className="text-red-500 text-sm mt-1">{errors.document_photo}</p>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Patient'}
                </button>
              </div>
            </form>
          </Modal>

          <StatusModal
            open={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            status={statusModalStatus}
            message={statusModalMessage}
          />
        </div>
      </div>
    </div>
  );
}