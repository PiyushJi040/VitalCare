import express from "express";
import { body, validationResult } from "express-validator";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Sample data - in production, this would be in a database
let medicines = [
  { id: 1, name: "Paracetamol", stock: 150, price: 5.50, expiry: "2025-06-15", status: "in-stock" },
  { id: 2, name: "Amoxicillin", stock: 5, price: 12.00, expiry: "2024-12-20", status: "low-stock" },
  { id: 3, name: "Ibuprofen", stock: 0, price: 8.75, expiry: "2025-03-10", status: "out-of-stock" }
];

let prescriptions = [
  { id: 1, patientName: "John Doe", doctor: "Dr. Smith", medicines: ["Paracetamol", "Ibuprofen"], status: "pending" },
  { id: 2, patientName: "Jane Smith", doctor: "Dr. Johnson", medicines: ["Amoxicillin"], status: "completed" }
];

// Get all medicines
router.get("/medicines", protect, (req, res) => {
  res.json({ success: true, data: medicines });
});

// Add new medicine
router.post("/medicines", [
  protect,
  body("name").notEmpty().withMessage("Medicine name is required"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
  body("price").isNumeric().withMessage("Price must be a number")
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, stock, price, expiry } = req.body;
  const newMedicine = {
    id: Date.now(),
    name,
    stock: parseInt(stock),
    price: parseFloat(price),
    expiry,
    status: parseInt(stock) > 10 ? "in-stock" : parseInt(stock) > 0 ? "low-stock" : "out-of-stock"
  };

  medicines.push(newMedicine);
  res.json({ success: true, data: newMedicine });
});

// Update medicine
router.put("/medicines/:id", protect, (req, res) => {
  const { id } = req.params;
  const { name, stock, price, expiry } = req.body;
  
  const medicineIndex = medicines.findIndex(m => m.id === parseInt(id));
  if (medicineIndex === -1) {
    return res.status(404).json({ success: false, message: "Medicine not found" });
  }

  medicines[medicineIndex] = {
    ...medicines[medicineIndex],
    name: name || medicines[medicineIndex].name,
    stock: stock !== undefined ? parseInt(stock) : medicines[medicineIndex].stock,
    price: price !== undefined ? parseFloat(price) : medicines[medicineIndex].price,
    expiry: expiry || medicines[medicineIndex].expiry,
    status: stock !== undefined ? 
      (parseInt(stock) > 10 ? "in-stock" : parseInt(stock) > 0 ? "low-stock" : "out-of-stock") :
      medicines[medicineIndex].status
  };

  res.json({ success: true, data: medicines[medicineIndex] });
});

// Delete medicine
router.delete("/medicines/:id", protect, (req, res) => {
  const { id } = req.params;
  const medicineIndex = medicines.findIndex(m => m.id === parseInt(id));
  
  if (medicineIndex === -1) {
    return res.status(404).json({ success: false, message: "Medicine not found" });
  }

  medicines.splice(medicineIndex, 1);
  res.json({ success: true, message: "Medicine deleted successfully" });
});

// Get all prescriptions
router.get("/prescriptions", protect, (req, res) => {
  res.json({ success: true, data: prescriptions });
});

// Update prescription status
router.put("/prescriptions/:id", protect, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const prescriptionIndex = prescriptions.findIndex(p => p.id === parseInt(id));
  if (prescriptionIndex === -1) {
    return res.status(404).json({ success: false, message: "Prescription not found" });
  }

  prescriptions[prescriptionIndex].status = status;
  res.json({ success: true, data: prescriptions[prescriptionIndex] });
});

export default router;