import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

// ── Async Thunks ─────────────────────────────────────────────

export const fetchProducts   = createAsyncThunk("products/fetch",   async () => (await api.get("/products")).data)
export const fetchCategories = createAsyncThunk("categories/fetch", async () => (await api.get("/categories")).data)
export const fetchOrders     = createAsyncThunk("orders/fetch",     async () => (await api.get("/orders")).data)
export const fetchRoles      = createAsyncThunk("roles/fetch",      async () => (await api.get("/roles")).data)
export const fetchUsers      = createAsyncThunk("users/fetch",      async () => (await api.get("/users")).data)

export const apiAddProduct    = createAsyncThunk("products/add",    async (data) => (await api.post("/products", data)).data)
export const apiUpdateProduct = createAsyncThunk("products/update", async (data) => (await api.put(`/products/${data._id}`, data)).data)
export const apiDeleteProduct = createAsyncThunk("products/delete", async (id)   => { await api.delete(`/products/${id}`); return id })

export const apiAddCategory    = createAsyncThunk("categories/add",    async (data) => (await api.post("/categories", data)).data)
export const apiUpdateCategory = createAsyncThunk("categories/update", async (data) => (await api.put(`/categories/${data._id}`, data)).data)
export const apiDeleteCategory = createAsyncThunk("categories/delete", async (id)   => { await api.delete(`/categories/${id}`); return id })

export const apiPlaceOrder       = createAsyncThunk("orders/place",  async (data) => (await api.post("/orders", data)).data)
export const apiUpdateOrderStatus = createAsyncThunk("orders/status", async ({ id, status }) => (await api.put(`/orders/${id}`, { status })).data)

export const apiAddRole    = createAsyncThunk("roles/add",    async (data) => (await api.post("/roles", data)).data)
export const apiDeleteRole = createAsyncThunk("roles/delete", async (id)   => { await api.delete(`/roles/${id}`); return id })

// ── Slices ────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, { payload }) {
      const ex = state.items.find(i => i.id === payload.id || i._id === payload._id)
      if (ex) ex.qty += 1
      else state.items.push({ ...payload, qty: 1 })
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter(i => i._id !== payload && i.id !== payload)
    },
    updateQty(state, { payload: { id, qty } }) {
      const item = state.items.find(i => i._id === id || i.id === id)
      if (item) item.qty = Math.max(0, qty)
      state.items = state.items.filter(i => i.qty > 0)
    },
    clearCart(state) { state.items = [] },
  },
})

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, isAdmin: false, user: null },
  reducers: {
    login(state, { payload }) {
      state.isLoggedIn = true
      state.isAdmin    = payload.isAdmin || false
      state.user       = payload.user
    },
    logout(state) {
      state.isLoggedIn = false
      state.isAdmin    = false
      state.user       = null
      localStorage.removeItem("token")
    },
  },
})

const productsSlice = createSlice({
  name: "products",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.loading = true })
      .addCase(fetchProducts.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload })
      .addCase(apiAddProduct.fulfilled,    (s, { payload }) => { s.list.push(payload) })
      .addCase(apiUpdateProduct.fulfilled, (s, { payload }) => { const i = s.list.findIndex(p => p._id === payload._id); if (i !== -1) s.list[i] = payload })
      .addCase(apiDeleteProduct.fulfilled, (s, { payload }) => { s.list = s.list.filter(p => p._id !== payload) })
  },
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending,   (s) => { s.loading = true })
      .addCase(fetchCategories.fulfilled, (s, { payload }) => { s.loading = false; s.list = payload })
      .addCase(apiAddCategory.fulfilled,    (s, { payload }) => { s.list.push(payload) })
      .addCase(apiUpdateCategory.fulfilled, (s, { payload }) => { const i = s.list.findIndex(c => c._id === payload._id); if (i !== -1) s.list[i] = payload })
      .addCase(apiDeleteCategory.fulfilled, (s, { payload }) => { s.list = s.list.filter(c => c._id !== payload) })
  },
})

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled,          (s, { payload }) => { s.list = payload })
      .addCase(apiPlaceOrder.fulfilled,        (s, { payload }) => { s.list.unshift(payload) })
      .addCase(apiUpdateOrderStatus.fulfilled, (s, { payload }) => { const i = s.list.findIndex(o => o._id === payload._id); if (i !== -1) s.list[i] = payload })
  },
})

const rolesSlice = createSlice({
  name: "roles",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.fulfilled,      (s, { payload }) => { s.list = payload })
      .addCase(apiAddRole.fulfilled,      (s, { payload }) => { s.list.push(payload) })
      .addCase(apiDeleteRole.fulfilled,   (s, { payload }) => { s.list = s.list.filter(r => r._id !== payload) })
  },
})

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (s, { payload }) => { s.list = payload })
  },
})

// ── Store ─────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    cart:       cartSlice.reducer,
    auth:       authSlice.reducer,
    products:   productsSlice.reducer,
    categories: categoriesSlice.reducer,
    orders:     ordersSlice.reducer,
    roles:      rolesSlice.reducer,
    users:      usersSlice.reducer,
  },
})

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions
export const { login, logout } = authSlice.actions