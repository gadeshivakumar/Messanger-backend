const API_BASE_URL = "https://messanger.shiva.jo3.org/api";


const jsonHeaders = {
  "Content-Type": "application/json"
};

// ================= AUTH APIs =================
export const authAPI = {
  login: async (phone, password) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: jsonHeaders,
      credentials: "include", // REQUIRED
      body: JSON.stringify({ phone, password })
    });
  },

  register: async (username, phone, password) => {
    return fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: jsonHeaders,
      credentials: "include",
      body: JSON.stringify({ username, phone, password })
    });
  },

  logout: async () => {
    return fetch(`${API_BASE_URL}/auth/logout`, {
      method: "DELETE",
      credentials: "include"
    });
  },

  checkLogin: async () => {
    return fetch(`${API_BASE_URL}/user/islogin`, {
      credentials: "include"
    });
  }
};

// ================= USER APIs =================
export const userAPI = {
  getContacts: async () => {
    return fetch(`${API_BASE_URL}/user/con`, {
      credentials: "include"
    });
  },

  addContact: async (name, phone) => {
    return fetch(`${API_BASE_URL}/user/add`, {
      method: "POST",
      headers: jsonHeaders,
      credentials: "include",
      body: JSON.stringify({ name, phone })
    });
  },

  deleteContact: async (phone) => {
    return fetch(`${API_BASE_URL}/user/delete/${phone}`, {
      method: "DELETE",
      credentials: "include"
    });
  },

  getUserDetails: async (phone) => {
    return fetch(`${API_BASE_URL}/user/getDetails/${phone}`, {
      credentials: "include"
    });
  },

  updateProfile: async (formData) => {
    return fetch(`${API_BASE_URL}/user/profile`, {
      method: "POST",
      credentials: "include",
      body: formData // DO NOT set Content-Type
    });
  },

  getMessages: async (phone) => {
    return fetch(`${API_BASE_URL}/user/getMessages`, {
      method: "POST",
      headers: jsonHeaders,
      credentials: "include",
      body: JSON.stringify({ phone })
    });
  },

  deleteMessage: async (phone, messageType, messageId) => {
    return fetch(
      `${API_BASE_URL}/user/${phone}/delMessage/${messageType}/${messageId}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    );
  }
};
