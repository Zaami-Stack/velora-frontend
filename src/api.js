const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("velora_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const api = {
  auth: {
    login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    register: (name, email, password, phone, securityQuestion, securityAnswer) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, phone, securityQuestion, securityAnswer }) }),
    me: () => request("/auth/me"),
    forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (email, answer, password) => request("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, answer, password }) }),
    updateProfile: (data) => request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
    changePassword: (currentPassword, newPassword) => request("/auth/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
  },
  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ""}`);
    },
    get: (id) => request(`/products/${id}`),
    categories: () => request("/products/categories"),
  },
  orders: {
    create: (items, shippingAddress) => request("/orders", { method: "POST", body: JSON.stringify({ items, shippingAddress }) }),
    list: () => request("/orders"),
    get: (id) => request(`/orders/${id}`),
    cancel: (id) => request(`/orders/${id}/cancel`, { method: "PATCH" }),
  },
  admin: {
    dashboard: () => request("/admin/dashboard"),
    orders: (status) => request(`/admin/orders${status && status !== "all" ? `?status=${status}` : ""}`),
    updateOrderStatus: (id, status) => request(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    users: () => request("/admin/users"),
    products: () => request("/admin/products"),
    createProduct: (data) => request("/admin/products", { method: "POST", body: JSON.stringify(data) }),
    updateProduct: (id, data) => request(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),
  },
};
