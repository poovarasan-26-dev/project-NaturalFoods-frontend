import { useEffect, useState } from 'react'
import {
  LogOut, TrendingUp, Users, CheckCircle, XCircle, Ban, ShoppingBag,
  DollarSign, Package, LayoutDashboard, BarChart3, Apple, ShoppingCart,
  Bell, UserCheck, Search, Plus, Edit3, Trash2, X, Leaf, AlertTriangle,
  MessagesSquare, Send
} from 'lucide-react'
import { clearAuthSession } from '../lib/api'
import { resolveImage } from '../lib/utils'

const API_BASE = ''
function getAnyToken() {
  return localStorage.getItem('naturalfoods_access_token') || localStorage.getItem('access_token')
}

function setBothTokens(access, refresh) {
  if (access) {
    localStorage.setItem('naturalfoods_access_token', access)
    localStorage.setItem('access_token', access)
  }
  if (refresh) {
    localStorage.setItem('naturalfoods_refresh_token', refresh)
    localStorage.setItem('refresh_token', refresh)
  }
}

async function tryAutoLogin() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    if (res.ok) {
      const json = await res.json()
      setBothTokens(json.access, json.refresh)
      return true
    }
  } catch (_) {}
  return false
}

  let _autoLoginTried = false

async function api(url, options = {}) {
  if (!getAnyToken() && !_autoLoginTried) {
    _autoLoginTried = true
    await tryAutoLogin()
  }
  const token = getAnyToken()
  const headers = { ...options.headers }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers })
  if (!res.ok && (res.status === 401 || res.status === 403)) {
    clearAuthSession()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/'
    throw new Error('Unauthorized')
  }
  return res
}

const SVG_3D = {
  apple: '<svg viewBox="0 0 64 64"><defs><radialGradient id="ga" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#ff7b90"/><stop offset="40%" stop-color="#e63946"/><stop offset="90%" stop-color="#a80c18"/><stop offset="100%" stop-color="#720007"/></radialGradient></defs><circle cx="32" cy="40" r="16" fill="url(#ga)"/><circle cx="42" cy="40" r="16" fill="url(#ga)"/></svg>',
  broccoli: '<svg viewBox="0 0 64 64"><defs><radialGradient id="gc" cx="30%" cy="35%" r="60%"><stop offset="0%" stop-color="#74c69d"/><stop offset="60%" stop-color="#2d6a4f"/><stop offset="100%" stop-color="#1b4332"/></radialGradient></defs><circle cx="24" cy="28" r="12" fill="url(#gc)"/><circle cx="40" cy="28" r="12" fill="url(#gc)"/><circle cx="32" cy="20" r="14" fill="url(#gc)"/></svg>',
  default: '<svg viewBox="0 0 64 64"><path d="M 32 46 C 32 46 18 32 24 18 Q 32 10 40 18 C 46 32 32 46 32 46 Z" fill="#2b9348"/></svg>'
}

function get3DVisual(key) {
  return SVG_3D[key] || SVG_3D.default
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [productModal, setProductModal] = useState({ open: false, edit: null })
  const [orderModal, setOrderModal] = useState(false)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState({})
  const [expandedMsg, setExpandedMsg] = useState(null)
  const [productForm, setProductForm] = useState({ name: '', category: 'fruits', price: '', price_unit: 'kg', stock: '', image_3d: 'apple', image: null })
  const [orderForm, setOrderForm] = useState({ customer_name: '', amount: '', status: 'pending', date: '' })

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'products') loadProducts()
    else if (activeTab === 'orders') loadOrders()
    else if (activeTab === 'customers') loadCustomers()
    else if (activeTab === 'notifications') loadNotifications()
    else if (activeTab === 'messages') loadMessages()
    else if (activeTab === 'analytics') loadStats()
    else if (activeTab === 'dashboard') loadStats()
  }, [activeTab])

  async function loadStats() {
    try {
      const res = await api('/api/dashboard/stats/')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setError('')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadProducts(query = '') {
    try {
      const url = `/api/dashboard/products/${query ? `?search=${encodeURIComponent(query)}` : ''}`
      const res = await api(url)
      if (res.ok) setProducts(await res.json())
    } catch (e) { console.error(e) }
  }

  async function loadOrders(query = '') {
    try {
      const url = `/api/dashboard/orders/${query ? `?search=${encodeURIComponent(query)}` : ''}`
      const res = await api(url)
      if (res.ok) setOrders(await res.json())
    } catch (e) { console.error(e) }
  }

  async function loadCustomers() {
    try {
      const res = await api('/api/dashboard/customers/')
      if (res.ok) setCustomers(await res.json())
    } catch (e) { console.error(e) }
  }

  async function loadNotifications() {
    try {
      const res = await api('/api/dashboard/notifications/')
      if (res.ok) setNotifications(await res.json())
    } catch (e) { console.error(e) }
  }

  async function loadMessages() {
    try {
      const res = await api('/api/messages/conversations/')
      if (res.ok) setMessages(await res.json())
    } catch (e) { console.error(e) }
  }

  async function handleReply(msgId) {
    if (!replyText.trim()) return
    setReplyLoading(prev => ({ ...prev, [msgId]: true }))
    try {
      const res = await api(`/api/messages/${msgId}/reply/`, {
        method: 'POST',
        body: JSON.stringify({ body: replyText.trim() })
      })
      if (res.ok) {
        setReplyText('')
        loadMessages()
      }
    } catch (e) { console.error(e) }
    finally { setReplyLoading(prev => ({ ...prev, [msgId]: false })) }
  }

  async function saveProduct(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', productForm.name)
    fd.append('category', productForm.category)
    fd.append('price', productForm.price)
    fd.append('price_unit', productForm.price_unit)
    fd.append('stock', productForm.stock)
    fd.append('image_3d', productForm.image_3d)
    if (productForm.image) fd.append('image', productForm.image)

    const isEdit = productModal.edit
    const url = isEdit ? `/api/dashboard/products/${isEdit}/` : '/api/dashboard/products/'
    const method = isEdit ? 'PATCH' : 'POST'
    try {
      const token = getAnyToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(url, { method, headers, body: fd })
      if (res.ok) {
        setProductModal({ open: false, edit: null })
        loadProducts()
      }
    } catch (e) { console.error(e) }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    try {
      const res = await api(`/api/dashboard/products/${id}/`, { method: 'DELETE' })
      if (res.ok || res.status === 204) loadProducts()
    } catch (e) { console.error(e) }
  }

  async function saveOrder(e) {
    e.preventDefault()
    try {
      const res = await api('/api/dashboard/orders/', {
        method: 'POST',
        body: JSON.stringify({
          order_id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_name: orderForm.customer_name,
          amount: parseFloat(orderForm.amount),
          status: orderForm.status,
          date: orderForm.date
        })
      })
      if (res.ok) {
        setOrderModal(false)
        loadOrders()
        loadStats()
      }
    } catch (e) { console.error(e) }
  }

  async function deleteOrder(id) {
    if (!confirm('Delete this order?')) return
    try {
      const res = await api(`/api/dashboard/orders/${id}/`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        loadOrders()
        loadStats()
      }
    } catch (e) { console.error(e) }
  }

  async function toggleCustomerValid(id, current) {
    try {
      await api(`/api/dashboard/customers/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_valid: !current })
      })
      loadCustomers()
    } catch (e) { console.error(e) }
  }

  const handleLogout = () => {
    clearAuthSession()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/'
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Apple },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: UserCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessagesSquare },
  ]

  if (loading) return (
    <div className="admin-loading">
      <div className="admin-loading-spinner" />
      <p>Loading dashboard...</p>
    </div>
  )

  if (error && !stats) return (
    <div className="admin-error-page">
      <AlertTriangle size={32} />
      <p>{error}</p>
      <button onClick={handleLogout} className="admin-btn-logout">Go Back</button>
    </div>
  )

  const statCards = [
    { label: "Today's Sales", value: `₹${(stats?.today_sales || 0).toLocaleString()}`, icon: DollarSign, color: '#2ecc71', sub: `${stats?.today_orders || 0} orders today` },
    { label: 'Total Sales', value: `₹${(stats?.total_sales || 0).toLocaleString()}`, icon: TrendingUp, color: '#3498db', sub: 'All time revenue' },
    { label: 'Total Customers', value: stats?.total_customers || 0, icon: Users, color: '#9b59b6', sub: 'Registered customers' },
    { label: 'Sales Wins', value: stats?.sales_win || 0, icon: CheckCircle, color: '#2ecc71', sub: 'Successful orders' },
    { label: 'Sales Losses', value: stats?.sales_loss || 0, icon: XCircle, color: '#e74c3c', sub: 'Cancelled orders' },
    { label: 'Not Valid', value: stats?.not_valid || 0, icon: Ban, color: '#f39c12', sub: 'Invalid accounts' },
    { label: 'Total Products', value: stats?.total_products || 0, icon: Package, color: '#1abc9c', sub: 'In catalog' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingBag, color: '#e67e22', sub: 'All orders placed' },
  ]

  return (
    <div className="admin-dashboard">
      <aside className="admin-dash-sidebar">
        <div className="admin-dash-brand">
          <Leaf size={20} />
          <span>Natural<span>Foods</span></span>
        </div>
        <nav className="admin-dash-nav">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`admin-dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-dash-sidebar-footer">
          <button className="admin-dash-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-dash-content">
        <header className="admin-dash-header">
          <div className="admin-dash-header-left">
            <h2>{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            {stats?.admin_info && (
              <span className="admin-dash-user-badge">{stats.admin_info.email}</span>
            )}
          </div>
          <div className="admin-dash-header-right">
            {activeTab === 'products' && (
              <div className="admin-dash-search">
                <Search size={16} />
                <input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); loadProducts(e.target.value) }}
                />
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="admin-dash-search">
                <Search size={16} />
                <input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); loadOrders(e.target.value) }}
                />
              </div>
            )}
          </div>
        </header>

        <main className="admin-dash-main">
          {/* ─── DASHBOARD TAB ─── */}
          {activeTab === 'dashboard' && (
            <>
              <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                  <div key={i} className="admin-stat-card" style={{ '--accent': card.color }}>
                    <div className="admin-stat-icon" style={{ background: `${card.color}1a`, color: card.color }}>
                      <card.icon size={22} />
                    </div>
                    <div className="admin-stat-body">
                      <span className="admin-stat-label">{card.label}</span>
                      <span className="admin-stat-value">{card.value}</span>
                      <span className="admin-stat-sub">{card.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              {stats?.monthly_growth && (
                <div className="admin-chart-section">
                  <h3 className="admin-section-title">Monthly Growth</h3>
                  <div className="admin-chart">
                    {stats.monthly_growth.map((m, i) => {
                      const max = Math.max(...stats.monthly_growth.map(x => x.sales))
                      const pct = (m.sales / max) * 100
                      return (
                        <div key={i} className="admin-chart-col">
                          <span className="admin-chart-bar-label">₹{(m.sales / 1000).toFixed(1)}k</span>
                          <div className="admin-chart-bar-wrap">
                            <div className="admin-chart-bar" style={{ height: `${pct}%` }} />
                          </div>
                          <span className="admin-chart-month">{m.month}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── ANALYTICS TAB ─── */}
          {activeTab === 'analytics' && (
            <AnalyticsView stats={stats} />
          )}

          {/* ─── PRODUCTS TAB ─── */}
          {activeTab === 'products' && (
            <div className="admin-dash-card">
              <div className="admin-dash-card-header">
                <h3>Products Catalog</h3>
                <button className="admin-btn-add" onClick={() => {
                  setProductForm({ name: '', category: 'fruits', price: '', price_unit: 'kg', stock: '', image_3d: 'apple', image: null })
                  setProductModal({ open: true, edit: null })
                }}>
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={6} className="admin-empty">No products found</td></tr>
                    ) : products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-product-visual"
                            dangerouslySetInnerHTML={{ __html: p.image
                              ? `<img src="${resolveImage(p.image)}" class="admin-product-img" />`
                              : get3DVisual(p.image_3d)
                            }}
                          />
                        </td>
                        <td className="admin-cell-bold">{p.name}</td>
                        <td><span className="admin-badge-cat">{p.category}</span></td>
                        <td className="admin-cell-price">₹{Math.round(parseFloat(p.price))}<span className="admin-cell-unit">/{p.price_unit || 'kg'}</span></td>
                        <td><span className={p.stock < 15 ? 'admin-stock-low' : ''}>{p.stock} units</span></td>
                        <td>
                          <div className="admin-cell-actions">
                            <button className="admin-btn-icon admin-btn-edit" onClick={() => {
                              setProductForm({
                                name: p.name, category: p.category, price: p.price,
                                price_unit: p.price_unit || 'kg', stock: p.stock,
                                image_3d: p.image_3d, image: null
                              })
                              setProductModal({ open: true, edit: p.id })
                            }}><Edit3 size={14} /></button>
                            <button className="admin-btn-icon admin-btn-del" onClick={() => deleteProduct(p.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── ORDERS TAB ─── */}
          {activeTab === 'orders' && (
            <div className="admin-dash-card">
              <div className="admin-dash-card-header">
                <h3>Orders Management</h3>
                <button className="admin-btn-add" onClick={() => {
                  setOrderForm({ customer_name: customers[0]?.name || '', amount: '', status: 'pending', date: new Date().toISOString().split('T')[0] })
                  setOrderModal(true)
                  loadCustomers()
                }}>
                  <Plus size={16} /> Add Order
                </button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="admin-empty">No orders found</td></tr>
                    ) : orders.map(o => (
                      <tr key={o.id}>
                        <td className="admin-cell-id">{o.order_id}</td>
                        <td className="admin-cell-bold">{o.customer_name}</td>
                        <td>{new Date(o.date).toLocaleDateString()}</td>
                        <td className="admin-cell-price">₹{Math.round(parseFloat(o.amount)).toLocaleString()}</td>
                        <td><span className={`admin-status admin-status-${o.status}`}>{o.status}</span></td>
                        <td>
                          <button className="admin-btn-icon admin-btn-del" onClick={() => deleteOrder(o.id)}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CUSTOMERS TAB ─── */}
          {activeTab === 'customers' && (
            <div className="admin-dash-card">
              <div className="admin-dash-card-header">
                <h3>Customers Registry</h3>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={4} className="admin-empty">No customers found</td></tr>
                    ) : customers.map(c => (
                      <tr key={c.id}>
                        <td className="admin-cell-bold">{c.name}</td>
                        <td>{c.email}</td>
                        <td>
                          <span className={`admin-status ${c.is_valid ? 'admin-status-win' : 'admin-status-loss'}`}>
                            {c.is_valid ? 'Verified' : 'Not Valid'}
                          </span>
                        </td>
                        <td>
                          <button className="admin-btn-sm" onClick={() => toggleCustomerValid(c.id, c.is_valid)}>
                            {c.is_valid ? 'Mark Invalid' : 'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── NOTIFICATIONS TAB ─── */}
          {activeTab === 'notifications' && (
            <div className="admin-dash-card">
              <div className="admin-dash-card-header">
                <h3>System Notifications</h3>
              </div>
              <div className="admin-notif-list">
                {notifications.length === 0 ? (
                  <div className="admin-empty">No notifications</div>
                ) : notifications.map(n => (
                  <div key={n.id} className="admin-notif-item">
                    <div className={`admin-notif-dot ${n.is_read ? 'read' : ''}`} />
                    <div className="admin-notif-text">
                      <p>{n.message}</p>
                      <span className="admin-notif-date">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── MESSAGES TAB ─── */}
          {activeTab === 'messages' && (
            <div className="admin-dash-card">
              <div className="admin-dash-card-header">
                <h3>User Messages</h3>
              </div>
              <div className="admin-table-wrap">
                {messages.length === 0 ? (
                  <div className="admin-empty">No messages from users</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
                    {messages.map(msg => (
                      <div key={msg.id} style={{
                        borderRadius: '14px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div
                          onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                          style={{
                            padding: '1rem', cursor: 'pointer',
                            background: msg.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(162,155,254,0.04)',
                            borderLeft: msg.is_read ? '3px solid transparent' : '3px solid var(--primary)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: 'rgba(162,155,254,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 800, color: '#a29bfe',
                              }}>
                                {msg.user_name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{msg.user_name || 'Unknown User'}</span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>({msg.user_email || ''})</span>
                            </div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{msg.subject}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {msg.body}
                          </p>
                          {msg.replies?.length > 0 && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#a29bfe', fontWeight: 600 }}>
                              {msg.replies.length} admin repl{msg.replies.length > 1 ? 'ies' : 'y'}
                            </div>
                          )}
                        </div>

                        {expandedMsg === msg.id && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.15)' }}>
                            {msg.replies?.map(reply => (
                              <div key={reply.id} style={{
                                padding: '0.5rem 0.75rem', borderRadius: '8px',
                                background: 'rgba(46,204,113,0.04)', marginBottom: '0.5rem',
                                borderLeft: '2px solid var(--primary)',
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>Admin</span>
                                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                    {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#ccc', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{reply.body}</p>
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <textarea
                                placeholder="Type your reply..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                rows={2}
                                style={{
                                  flex: 1, padding: '0.5rem 0.75rem', borderRadius: '10px',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  background: 'rgba(255,255,255,0.04)', color: '#fff',
                                  fontSize: '0.8rem', resize: 'none', outline: 'none',
                                  fontFamily: 'inherit',
                                }}
                              />
                              <button
                                onClick={() => handleReply(msg.id)}
                                disabled={replyLoading[msg.id] || !replyText.trim()}
                                style={{
                                  padding: '0.5rem 1rem', borderRadius: '10px',
                                  border: 'none', background: replyLoading[msg.id] ? 'var(--primary-dim)' : 'var(--primary)',
                                  color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                                  cursor: replyLoading[msg.id] || !replyText.trim() ? 'not-allowed' : 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                                }}
                              >
                                <Send size={14} />
                                {replyLoading[msg.id] ? 'Sending...' : 'Reply'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {productModal.open && (
        <div className="admin-modal-overlay" onClick={() => setProductModal({ open: false, edit: null })}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{productModal.edit ? 'Edit Product' : 'Add Product'}</h3>
              <button className="admin-modal-close" onClick={() => setProductModal({ open: false, edit: null })}><X size={20} /></button>
            </div>
            <form onSubmit={saveProduct} className="admin-modal-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name</label>
                  <input required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                    {['fruits', 'nutritions', 'vegetables', 'dairy', 'grains', 'grocery', 'beverages'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (₹)</label>
                  <input type="number" step="0.01" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Unit</label>
                  <select value={productForm.price_unit} onChange={e => setProductForm({ ...productForm, price_unit: e.target.value })}>
                    <option value="kg">Per Kg</option>
                    <option value="gram">Per Gram</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input type="number" required value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>3D Visual</label>
                  <select value={productForm.image_3d} onChange={e => setProductForm({ ...productForm, image_3d: e.target.value })}>
                    {['apple', 'broccoli', 'honey', 'milk', 'avocado', 'grains', 'cheese', 'blueberry', 'spinach'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => setProductForm({ ...productForm, image: e.target.files[0] })} />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setProductModal({ open: false, edit: null })}>Cancel</button>
                <button type="submit" className="admin-btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div className="admin-modal-overlay" onClick={() => setOrderModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add Order</h3>
              <button className="admin-modal-close" onClick={() => setOrderModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={saveOrder} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Customer</label>
                <select value={orderForm.customer_name} onChange={e => setOrderForm({ ...orderForm, customer_name: e.target.value })} required>
                  <option value="">Select customer</option>
                  {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Amount (₹)</label>
                  <input type="number" step="0.01" required value={orderForm.amount} onChange={e => setOrderForm({ ...orderForm, amount: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={orderForm.status} onChange={e => setOrderForm({ ...orderForm, status: e.target.value })}>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Date</label>
                  <input type="date" required value={orderForm.date} onChange={e => setOrderForm({ ...orderForm, date: e.target.value })} />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setOrderModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AnalyticsView({ stats }) {
  if (!stats?.monthly_growth) return <div className="admin-empty">No analytics data available</div>

  const max = Math.max(...stats.monthly_growth.map(m => m.sales))
  const colors = ['#2ec4b6', '#3498db', '#9b59b6', '#e67e22', '#2ecc71', '#f1c40f', '#e74c3c', '#1abc9c']

  return (
    <>
      <div className="admin-chart-section">
        <h3 className="admin-section-title">Monthly Revenue</h3>
        <div className="admin-chart" style={{ height: 250 }}>
          {stats.monthly_growth.map((m, i) => (
            <div key={i} className="admin-chart-col">
              <span className="admin-chart-bar-label">₹{(m.sales / 1000).toFixed(1)}k</span>
              <div className="admin-chart-bar-wrap">
                <div className="admin-chart-bar" style={{ height: `${(m.sales / max) * 100}%`, background: colors[i % colors.length] }} />
              </div>
              <span className="admin-chart-month">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {stats?.category_sales && stats.category_sales.length > 0 && (
        <div className="admin-dash-card">
          <h3 className="admin-section-title" style={{ margin: '0 0 1rem 0' }}>Category Sales</h3>
          <div className="admin-analytics-cats">
            {stats.category_sales.map((c, i) => {
              const total = stats.category_sales.reduce((s, x) => s + x.sales, 0)
              const pct = ((c.sales / total) * 100).toFixed(1)
              return (
                <div key={i} className="admin-analytics-cat-bar">
                  <div className="admin-analytics-cat-label">
                    <span>{c.name}</span>
                    <span>₹{c.sales.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="admin-analytics-cat-track">
                    <div className="admin-analytics-cat-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {stats?.monthly_orders && (
        <div className="admin-chart-section">
          <h3 className="admin-section-title">Orders Overview</h3>
          <div className="admin-chart" style={{ height: 220 }}>
            {stats.monthly_orders.map((m, i) => {
              const total = Math.max(m.win + m.loss + m.pending, 1)
              const winH = (m.win / total) * 100
              const lossH = (m.loss / total) * 100
              const pendH = (m.pending / total) * 100
              return (
                <div key={i} className="admin-chart-col">
                  <div className="admin-chart-bar-wrap" style={{ flexDirection: 'column-reverse', gap: 1 }}>
                    {m.pending > 0 && <div className="admin-chart-bar" style={{ height: `${pendH}%`, background: '#f1c40f', width: '80%', minHeight: 2 }} />}
                    {m.loss > 0 && <div className="admin-chart-bar" style={{ height: `${lossH}%`, background: '#e74c3c', width: '80%', minHeight: 2 }} />}
                    {m.win > 0 && <div className="admin-chart-bar" style={{ height: `${winH}%`, background: '#2ecc71', width: '80%', minHeight: 2 }} />}
                  </div>
                  <span className="admin-chart-month">{m.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
