import React from "react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
    ShoppingBag,
    User,
    Phone,
    Mail,
    MapPin,
    Plus,
    Trash2,
    Edit3,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    Receipt,
    Calendar,
    ArrowRight,
    Search,
    X,
    Filter
} from "lucide-react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Create/Edit State ---
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '', address: '', status: 'pending' });
    const [cart, setCart] = useState([]);
    const [selectedItem, setSelectedItem] = useState({ product_id: '', quantity: 1 });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [orderRes, productRes] = await Promise.all([
                api.get("/orders"),
                api.get("/products")
            ]);
            setOrders(groupOrders(orderRes.data));
            setProducts(productRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const groupOrders = (data) => {
        const map = {};
        data.forEach((row) => {
            if (!map[row.order_id]) {
                map[row.order_id] = {
                    id: row.order_id,
                    customer_name: row.customer_name,
                    customer_phone: row.customer_phone,
                    customer_email: row.customer_email || 'N/A',
                    address: row.address,
                    status: row.status,
                    created_at: row.created_at,
                    items: [],
                };
            }
            if (row.product_name) {
                map[row.order_id].items.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    quantity: row.quantity,
                    price: row.price_at_time,
                });
            }
        });
        return Object.values(map).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    const addToCart = () => {
        if (!selectedItem.product_id) return;
        const prod = products.find(p => p.id === selectedItem.product_id);
        const existing = cart.find(item => item.product_id === prod.id);

        if (existing) {
            setCart(cart.map(item =>
                item.product_id === prod.id
                    ? { ...item, quantity: item.quantity + parseInt(selectedItem.quantity) }
                    : item
            ));
        } else {
            setCart([...cart, {
                product_id: prod.id,
                name: prod.name,
                price: prod.price,
                quantity: parseInt(selectedItem.quantity)
            }]);
        }
        setSelectedItem({ product_id: '', quantity: 1 });
    };

    const handleSaveOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Please add at least one item to the cart.");
            return;
        }

        const payload = {
            customer_name: customer.name,
            customer_phone: customer.phone,
            customer_email: customer.email,
            customer_address: customer.address,
            items: cart,
            status: customer.status || 'pending'
        };

        try {
            if (editId) {
                await api.put(`/orders/${editId}`, payload);
            } else {
                await api.post("/orders", payload);
            }
            resetForm();
            fetchInitialData();
        } catch (err) {
            alert("Action failed");
        }
    };

    const startEdit = (order) => {
        setEditId(order.id);
        setCustomer({
            name: order.customer_name,
            phone: order.customer_phone,
            email: order.customer_email,
            address: order.address,
            status: order.status
        });
        setCart(order.items.map(i => ({
            product_id: i.product_id,
            name: i.product_name,
            price: i.price,
            quantity: i.quantity
        })));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditId(null);
        setCart([]);
        setCustomer({ name: '', phone: '', email: '', address: '', status: 'pending' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 size={12} />;
            case 'shipped': return <Truck size={12} />;
            case 'cancelled': return <AlertCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    return (
        <div className="min-h-screen bg-bg-main font-inter">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-24 pb-20 px-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                            <Receipt className="text-primary" size={28} />
                            Orders
                        </h1>
                        <p className="text-text-secondary mt-1">Manage and track your customer orders.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary">
                            <Filter size={18} className="mr-2" /> Filter
                        </button>
                        <button className="btn-secondary">
                            <Calendar size={18} className="mr-2" /> History
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Form */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="card sticky top-24">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                {editId ? <Edit3 size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
                                {editId ? 'Edit Order' : 'Create New Order'}
                            </h2>

                            <form onSubmit={handleSaveOrder} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Customer Name</label>
                                    <input
                                        type="text" required className="input" placeholder="e.g. John Doe"
                                        value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Phone</label>
                                        <input
                                            type="tel" required className="input" placeholder="+1..."
                                            value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Status</label>
                                        <select
                                            className="input appearance-none"
                                            value={customer.status} onChange={e => setCustomer({ ...customer, status: e.target.value })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Email</label>
                                    <input
                                        type="email" className="input" placeholder="john@example.com"
                                        value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Delivery Address</label>
                                    <textarea
                                        required className="input min-h-[80px]" placeholder="Full street address..."
                                        value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-3 block">Add Products</label>
                                    <div className="flex gap-2 mb-4">
                                        <select
                                            className="input flex-1"
                                            value={selectedItem.product_id}
                                            onChange={e => setSelectedItem({ ...selectedItem, product_id: e.target.value })}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number" min="1" className="input w-20"
                                            value={selectedItem.quantity}
                                            onChange={e => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
                                        />
                                        <button
                                            type="button" onClick={addToCart}
                                            className="btn-secondary px-3"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>

                                    {/* Cart List */}
                                    <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-bg-main border border-border">
                                                <div className="text-xs">
                                                    <p className="font-bold text-text-main">{item.name}</p>
                                                    <p className="text-text-secondary">Qty: {item.quantity} × ${item.price}</p>
                                                </div>
                                                <button
                                                    type="button" onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                                    className="text-rose-500 p-1 hover:bg-rose-50 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {cart.length === 0 && (
                                            <div className="text-center py-4 border-2 border-dashed border-border rounded-xl">
                                                <p className="text-xs text-text-secondary">Cart is empty</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        {editId && (
                                            <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                                                Cancel
                                            </button>
                                        )}
                                        <button type="submit" className="btn-primary flex-1">
                                            {editId ? 'Update Order' : 'Create Order'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Order List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Total Items</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-text-secondary">Loading orders...</td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-text-secondary">No orders found.</td>
                                        </tr>
                                    ) : orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <tr className="hover:bg-bg-main/50 cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                                <td className="font-mono text-xs font-bold text-primary">#{order.id.slice(0, 8)}</td>
                                                <td>
                                                    <p className="font-bold text-text-main">{order.customer_name}</p>
                                                    <p className="text-xs text-text-secondary">{order.customer_phone}</p>
                                                </td>
                                                <td>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingBag size={14} className="text-text-secondary" />
                                                        <span className="font-semibold">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                                    </div>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => startEdit(order)}
                                                            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                                            className="p-2 text-text-secondary hover:bg-bg-main rounded-lg"
                                                        >
                                                            {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedId === order.id && (
                                                <tr className="bg-bg-main/30">
                                                    <td colSpan="5" className="p-4">
                                                        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                                                            <div className="space-y-3">
                                                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Customer Details</h4>
                                                                <div className="grid gap-2">
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <Mail size={14} className="text-text-secondary" /> {order.customer_email}
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <MapPin size={14} className="text-text-secondary" /> {order.address}
                                                                    </div>
                                                                    <div className="flex items-center gap-3 text-sm">
                                                                        <Calendar size={14} className="text-text-secondary" /> {new Date(order.created_at).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Order Items</h4>
                                                                <div className="space-y-2">
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-surface rounded-lg border border-border">
                                                                            <span>{item.product_name} <span className="text-text-secondary ml-1">× {item.quantity}</span></span>
                                                                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex justify-between items-center pt-2 border-t border-border mt-2 px-2">
                                                                        <span className="font-bold text-text-main">Total Amount</span>
                                                                        <span className="font-bold text-lg text-primary">
                                                                            ${order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}