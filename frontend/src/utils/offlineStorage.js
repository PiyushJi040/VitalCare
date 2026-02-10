// Simple offline storage utility
class OfflineStorage {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  setItem(key, data) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        synced: this.isOnline
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error storing data offline:', error);
      return false;
    }
  }

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing offline data:', error);
      return false;
    }
  }

  cacheMedicineInventory(data) {
    return this.setItem('medicine_inventory', data);
  }

  getCachedMedicineInventory() {
    return this.getItem('medicine_inventory');
  }

  isDeviceOnline() {
    return this.isOnline;
  }

  clearCache() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }
}

const offlineStorage = new OfflineStorage();
export default offlineStorage;