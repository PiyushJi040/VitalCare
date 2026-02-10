import express from 'express';
import blockchain from '../blockchain/PrescriptionBlockchain.js';

const router = express.Router();

// Create prescription (Doctor)
router.post('/create', async (req, res) => {
  try {
    const { patientId, doctorId, medicines, diagnosis, instructions } = req.body;
    
    const prescription = {
      id: Date.now().toString(),
      patientId,
      doctorId,
      medicines,
      diagnosis,
      instructions,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const block = blockchain.addPrescription(prescription);
    
    res.status(201).json({
      message: 'Prescription created and added to blockchain',
      blockHash: block.hash,
      prescription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
});

// Get patient prescriptions
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = blockchain.getPrescriptionsByPatient(patientId);
    
    res.json({
      message: 'Prescriptions retrieved from blockchain',
      prescriptions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving prescriptions', error: error.message });
  }
});

// Verify prescription
router.get('/verify/:blockHash', async (req, res) => {
  try {
    const { blockHash } = req.params;
    const isValid = blockchain.verifyPrescription(blockHash);
    
    res.json({
      blockHash,
      isValid,
      message: isValid ? 'Prescription is valid' : 'Prescription verification failed'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying prescription', error: error.message });
  }
});

export default router;