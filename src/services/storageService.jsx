const storageService = {
    setJsonItem(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    setItem(key, value) {
      localStorage.setItem(key, value);
    },

    getItem(key) {
      const value = localStorage.getItem(key);
      return value ?? JSON.parse(value);
    },

    removeItem(key) {
      localStorage.removeItem(key);
    },

    clear() {
      localStorage.clear();
    },

    // Optionally, add expiration handling
    setItemWithExpiry(key, value, expiryTimeInMinutes) {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + expiryTimeInMinutes * 60000
      };
      localStorage.setItem(key, JSON.stringify(item));
    },

    getItemWithExpiry(key) {
      const item = JSON.parse(localStorage.getItem(key));
      if (!item) return null;

      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key); // Remove expired item
        return null;
      }
      return item.value;
    }
  };

export default storageService;
