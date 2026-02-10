import React, { useState } from 'react';
import { Shield, FileText, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const PrescriptionBlockchain = ({ patientId, doctorId }) => {
  const [prescription, setPrescription] = useState({
    medicines: '',
    diagnosis: '',
    instructions: ''
  });
  const [blockHash, setBlockHash] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const createPrescription = async () => {
    if (!prescription.medicines || !prescription.diagnosis) return;
    
    setIsCreating(true);
    try {
      const response = await api.post('/prescription/create', {
        patientId,
        doctorId,
        medicines: prescription.medicines.split(',').map(m => m.trim()),
        diagnosis: prescription.diagnosis,
        instructions: prescription.instructions
      });
      
      setBlockHash(response.data.blockHash);
      setPrescription({ medicines: '', diagnosis: '', instructions: '' });
      loadPrescriptions();
    } catch (error) {
      console.error('Error creating prescription:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const response = await api.get(`/prescription/patient/${patientId}`);
      setPrescriptions(response.data.prescriptions);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    }
  };

  const verifyPrescription = async (hash) => {
    try {
      const response = await api.get(`/prescription/verify/${hash}`);
      alert(response.data.message);
    } catch (error) {
      console.error('Error verifying prescription:', error);
    }
  };

  React.useEffect(() => {
    if (patientId) loadPrescriptions();
  }, [patientId]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Blockchain Prescription</h3>
      </div>

      {doctorId && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h4 className="font-semibold mb-3 text-white">Create New Prescription</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Medicines (comma separated)"
              value={prescription.medicines}
              onChange={(e) => setPrescription({...prescription, medicines: e.target.value})}
              className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
            />
            <input
              type="text"
              placeholder="Diagnosis"
              value={prescription.diagnosis}
              onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
              className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded"
            />
            <textarea
              placeholder="Instructions"
              value={prescription.instructions}
              onChange={(e) => setPrescription({...prescription, instructions: e.target.value})}
              className="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded h-20"
            />
            <button
              onClick={createPrescription}
              disabled={isCreating || !prescription.medicines || !prescription.diagnosis}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
          
          {blockHash && (
            <div className="mt-4 p-3 bg-green-900 rounded border border-green-500">
              <div className="flex items-center gap-2 text-green-300">
                <Check className="h-4 w-4" />
                <span className="font-medium">Prescription added to blockchain!</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">Block Hash: {blockHash.substring(0, 20)}...</p>
            </div>
          )}
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-3 text-white">Patient Prescriptions</h4>
        {prescriptions.length === 0 ? (
          <p className="text-gray-400">No prescriptions found</p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((item, index) => (
              <div key={index} className="border border-gray-600 bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-white">Prescription #{item.prescription.id}</span>
                    </div>
                    <p className="text-gray-300"><strong>Diagnosis:</strong> {item.prescription.diagnosis}</p>
                    <p className="text-gray-300"><strong>Medicines:</strong> {item.prescription.medicines?.join(', ')}</p>
                    {item.prescription.instructions && (
                      <p className="text-gray-300"><strong>Instructions:</strong> {item.prescription.instructions}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      Created: {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => verifyPrescription(item.blockHash)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                  >
                    <Shield className="h-4 w-4" />
                    Verify
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Block: {item.blockHash.substring(0, 16)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionBlockchain;