import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

import { Package, Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Wifi, WifiOff, Download, LogOut, ArrowLeft, ShoppingCart, Minus } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";
import GlobalLanguageSelector from "../src/components/GlobalLanguageSelector";

const PharmacyDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success(t("loggedOutSuccessfully"));
    navigate("/landing");
  };
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", stock: 150, price: 55, expiry: "2025-06-15", status: "in-stock" },
    { id: 2, name: "Amoxicillin", stock: 5, price: 120, expiry: "2024-12-20", status: "low-stock" },
    { id: 3, name: "Ibuprofen", stock: 0, price: 87, expiry: "2025-03-10", status: "out-of-stock" }
  ]);
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patientName: "Rahul Sharma", doctor: "Dr. Priya Gupta", medicines: ["Paracetamol", "Ibuprofen"], status: "pending" },
    { id: 2, patientName: "Anita Singh", doctor: "Dr. Rajesh Kumar", medicines: ["Amoxicillin"], status: "completed" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", stock: "", price: "", expiry: "" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customerLocation, setCustomerLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const cachedMedicines = offlineStorage.getCachedMedicineInventory();
    if (cachedMedicines) setMedicines(cachedMedicines);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.stock && newMedicine.price) {
      const medicine = {
        id: Date.now(),
        ...newMedicine,
        stock: parseInt(newMedicine.stock),
        price: parseFloat(newMedicine.price),
        status: parseInt(newMedicine.stock) > 10 ? "in-stock" : parseInt(newMedicine.stock) > 0 ? "low-stock" : "out-of-stock",
        synced: isOnline
      };
      const updatedMedicines = [...medicines, medicine];
      setMedicines(updatedMedicines);
      offlineStorage.cacheMedicineInventory(updatedMedicines);
      
      if (!isOnline) {
        setPendingChanges([...pendingChanges, { type: 'add', data: medicine }]);
      }
      
      setNewMedicine({ name: "", stock: "", price: "", expiry: "" });
      setShowAddMedicine(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ medicines, prescriptions, timestamp: new Date() }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pharmacy-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const addToCart = (medicine) => {
    if (medicine.status === 'out-of-stock') {
      toast.error(t('medicineOutOfStock'));
      return;
    }
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      if (existingItem.quantity >= medicine.stock) {
        toast.error(t('cannotAddMoreThanStock'));
        return;
      }
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
    toast.success(`${medicine.name} ${t('addedToCart')}`);
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    const medicine = medicines.find(m => m.id === medicineId);
    if (newQuantity > medicine.stock) {
      toast.error(t('cannotExceedStock'));
      return;
    }
    setCart(cart.map(item => 
      item.id === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const processOrder = () => {
    if (!customerLocation.trim()) {
      toast.error(t('pleaseEnterDeliveryLocation'));
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error(t('pleaseEnterPhoneNumber'));
      return;
    }
    if (cart.length === 0) {
      toast.error(t('cartIsEmpty'));
      return;
    }
    toast.success(`${t('orderPlacedFor')} ${cart.length} ${t('items')}. ${t('total')}: ₹${getTotalPrice()}`);
    setCart([]);
    setShowCart(false);
    setCustomerLocation('');
    setPhoneNumber('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock": return "text-green-600 bg-green-100";
      case "low-stock": return "text-yellow-600 bg-yellow-100";
      case "out-of-stock": return "text-red-600 bg-red-100";
      default: return "text-gray-400 bg-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <GlobalLanguageSelector />
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-700"
              onClick={() => navigate("/landing")}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToHome")}
            </button>
            <div>
              <p className="text-blue-700 text-lg">
                {t("hello")} {user?.name || t("pharmacyManager")},
              </p>
              <h1 className="text-4xl font-bold text-white">{t("pharmacyDashboard")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isOnline ? (
              <div className="flex items-center text-green-600">
                <Wifi className="h-5 w-5 mr-1" />
                <span className="text-sm">{t("online")}</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <WifiOff className="h-5 w-5 mr-1" />
                <span className="text-sm">{t("offline")}</span>
              </div>
            )}
            <button
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> {t("export")}
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2 relative"
            >
              <ShoppingCart className="h-4 w-4" /> {t("cart")}
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <button 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> {t("logout")}
            </button>
          </div>
        </div>
        {pendingChanges.length > 0 && (
          <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <strong>{pendingChanges.length}</strong> {t("changesPendingSync")}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{medicines.length}</p>
              <p className="text-gray-400">{t("totalMedicines")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{medicines.filter(m => m.status === "in-stock").length}</p>
              <p className="text-gray-400">{t("inStock")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{medicines.filter(m => m.status === "low-stock").length}</p>
              <p className="text-gray-400">{t("lowStock")}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Trash2 className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{medicines.filter(m => m.status === "out-of-stock").length}</p>
              <p className="text-gray-400">{t("outOfStock")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medicine Inventory */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t("medicineInventory")}</h2>
            <button
              onClick={() => setShowAddMedicine(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> {t("addMedicine")}
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchMedicines")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{medicine.name}</h3>
                    <p className="text-sm text-gray-400">{t("stock")}: {medicine.stock} {t("units")}</p>
                    <p className="text-sm text-gray-400">{t("price")}: ₹{medicine.price}</p>
                    <p className="text-sm text-gray-400">{t("expiry")}: {medicine.expiry}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medicine.status)}`}>
                      {medicine.status.replace("-", " ").toUpperCase()}
                    </span>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.status === 'out-of-stock'}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {t("addToCart")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t("recentPrescriptions")}</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{prescription.patientName}</h3>
                    <p className="text-sm text-gray-400">{t("doctor")}: {prescription.doctor}</p>
                    <p className="text-sm text-gray-400">{t("medicines")}: {prescription.medicines.join(", ")}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prescription.status === "completed" ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"
                  }`}>
                    {prescription.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{t("addNewMedicine")}</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t("medicineName")}
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded"
              />
              <input
                type="number"
                placeholder={t("stockQuantity")}
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine({...newMedicine, stock: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder={t("price")}
                value={newMedicine.price}
                onChange={(e) => setNewMedicine({...newMedicine, price: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded"
              />
              <input
                type="date"
                placeholder={t("expiryDate")}
                value={newMedicine.expiry}
                onChange={(e) => setNewMedicine({...newMedicine, expiry: e.target.value})}
                className="w-full p-2 border border-gray-600 rounded"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddMedicine}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {t("addMedicine")}
              </button>
              <button
                onClick={() => setShowAddMedicine(false)}
                className="bg-gray-300 text-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">{t("cart")}</h3>
              <button onClick={() => setShowCart(false)} className="text-white hover:text-gray-200">
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("deliveryLocation")}</label>
                  <input
                    type="text"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    placeholder={t("enterAddress")}
                    className="w-full p-2 border border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t("phoneNumber")}</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t("enterPhoneNumber")}
                    className="w-full p-2 border border-gray-600 rounded"
                  />
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>{t("yourCartIsEmpty")}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-900 p-3 rounded">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-400">₹{item.price} {t("each")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-300 text-gray-300 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-400"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-300 text-gray-300 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-400"
                        >
                          +
                        </button>
                        <span className="ml-2 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">{t("total")}: ₹{getTotalPrice()}</span>
                    <span className="text-sm text-gray-400">{cart.length} {t("items")}</span>
                  </div>
                  <button
                    onClick={processOrder}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    {t("placeOrder")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
