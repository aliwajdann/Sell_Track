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
    Search
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
        switch(status) {
            case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-orange-50 text-orange-600 border-orange-100';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'delivered': return <CheckCircle2 size={12} />;
            case 'shipped': return <Truck size={12} />;
            case 'cancelled': return <AlertCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    return (
        <div className="min-h-screen bg-bg-main">
            <Navbar />
            
            <main className="max-w-7xl mx-auto pt-28 pb-20 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                Sales & Distribution
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight flex items-center gap-3">
                            <Receipt className="text-primary" size={32} />
                            Orders Manager
                        </h1>
                        <p className="text-text-muted mt-2 font-medium">Create new orders and manage customer fulfillment.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="card-premium py-2 px-6 flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-xs font-black text-text-main uppercase tracking-widest">System Online</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-5">
                        <div className={`card-premium sticky top-28 transition-all duration-500 ${editId ? 'ring-2 ring-primary border-primary/20 shadow-xl shadow-primary/5' : ''}`}>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-text-main tracking-tight uppercase">
                                    {editId ? 'Edit Order Details' : 'Create New Order'}
                                </h2>
                                {editId && (
                                    <button onClick={resetForm} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                        Discard Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSaveOrder} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input className="input-premium pl-12" placeholder="Customer Full Name" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                            <input className="input-premium pl-12" placeholder="Phone" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} required />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                            <input className="input-premium pl-12" placeholder="Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                        <input className="input-premium pl-12" placeholder="Shipping Address" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} required />
                                    </div>
                                    
                                    {editId && (
                                        <div className="space-y-2 pt-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Order Status</label>
                                            <select className="input-premium appearance-none bg-bg-main" value={customer.status} onChange={e => setCustomer({ ...customer, status: e.target.value })}>
                                                <option value="pending">Pending Approval</option>
                                                <option value="shipped">Shipped Out</option>
                                                <option value="delivered">Fully Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Add Items to Cart</h3>
                                    <div className="flex flex-col gap-3 p-4 rounded-3xl bg-bg-main border border-border">
                                        <select className="bg-transparent outline-none font-bold text-sm text-text-main px-2 py-1" value={selectedItem.product_id} onChange={e => setSelectedItem({ ...selectedItem, product_id: e.target.value })}>
                                            <option value="">Choose a product...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>)}
                                        </select>
                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-text-muted">QTY:</span>
                                                <input type="number" className="w-12 bg-transparent font-black text-primary outline-none" value={selectedItem.quantity} onChange={e => setSelectedItem({ ...selectedItem, quantity: e.target.value })} min="1" />
                                            </div>
                                            <button type="button" onClick={addToCart} className="bg-text-main text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition flex items-center gap-2">
                                                <Plus size={14} /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Cart Preview */}
                                {cart.length > 0 && (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {cart.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-border shadow-sm group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-black text-xs">
                                                        {item.quantity}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-text-main">{item.name}</p>
                                                        <p className="text-[10px] text-text-muted font-bold">${item.price} each</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-text-main text-sm">${(item.quantity * item.price).toFixed(2)}</span>
                                                    <button type="button" onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-text-muted hover:text-red-500 transition">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <div className="flex justify-between items-center mb-6 px-2">
                                        <span className="text-text-muted font-bold">Grand Total</span>
                                        <span className="text-3xl font-black text-text-main tracking-tighter">
                                            <span className="text-primary text-xl mr-1">$</span>
                                            {cart.reduce((sum, i) => sum + (i.quantity * i.price), 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg">
                                        <ShoppingBag size={20} />
                                        <span>{editId ? 'Update Order' : 'Complete Purchase'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: HISTORY */}
                    <div className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-8">
                             <h2 className="text-xl font-black text-text-main tracking-tight uppercase">Recent Orders</h2>
                             <div className="flex items-center gap-2 text-text-muted">
                                <Search size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Filter: All Time</span>
                             </div>
                        </div>

                        {loading ? (
                             <div className="space-y-6">
                                {[1,2,3].map(i => <div key={i} className="card-premium h-24 animate-pulse border-none bg-gray-200/50"></div>)}
                             </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => {
                                    const total = order.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
                                    const isExpanded = expandedId === order.id;

                                    return (
                                        <div key={order.id} className={`group bg-white rounded-[2rem] border border-border shadow-sm transition-all duration-500 overflow-hidden ${isExpanded ? 'ring-2 ring-primary border-primary/20 shadow-xl' : 'hover:shadow-md hover:border-primary/20'}`}>
                                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                                                <div className="flex items-start gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${isExpanded ? 'bg-primary text-white border-primary' : 'bg-bg-main text-text-muted group-hover:bg-accent group-hover:text-primary'}`}>
                                                        <Receipt size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1.5">
                                                            <span className="text-[10px] font-black text-text-muted flex items-center gap-1 uppercase tracking-widest">
                                                                <Calendar size={10} /> {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{order.customer_name}</h3>
                                                        <p className="text-[10px] text-text-muted font-black tracking-[0.2em] uppercase mt-1">ID: {order.id.slice(0, 12)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 border-border pt-4 md:pt-0">
                                                    <p className="text-3xl font-black text-text-main tracking-tighter">${total.toFixed(2)}</p>
                                                    <div className="flex items-center gap-2 text-text-muted mt-1">
                                                        <span className="text-xs font-bold uppercase tracking-widest">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="px-8 pb-8 pt-0 animate-in slide-in-from-top-4 duration-500">
                                                    <div className="grid md:grid-cols-2 gap-10 p-8 rounded-3xl bg-bg-main border border-border">
                                                        <div className="space-y-6">
                                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                                                <div className="w-1 h-1 rounded-full bg-primary"></div> Shipping Details
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary">
                                                                        <Mail size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-text-muted uppercase">Email Address</p>
                                                                        <p className="text-sm font-bold text-text-main">{order.customer_email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary">
                                                                        <Phone size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-text-muted uppercase">Contact Number</p>
                                                                        <p className="text-sm font-bold text-text-main">{order.customer_phone}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary">
                                                                        <MapPin size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-text-muted uppercase">Delivery Location</p>
                                                                        <p className="text-sm font-bold text-text-main leading-snug">{order.address}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                                                <div className="w-1 h-1 rounded-full bg-primary"></div> Items Summary
                                                            </h4>
                                                            <div className="space-y-3">
                                                                {order.items.map((item, i) => (
                                                                    <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0 group/item">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="w-6 h-6 rounded bg-white border border-border flex items-center justify-center text-[10px] font-black text-text-main">{item.quantity}x</span>
                                                                            <span className="text-sm font-bold text-text-main group-hover/item:text-primary transition-colors">{item.product_name}</span>
                                                                        </div>
                                                                        <span className="font-black text-text-main text-sm">${(item.quantity * item.price).toFixed(2)}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="flex justify-between pt-4 mt-2">
                                                                    <span className="text-sm font-black text-text-main">Total Receivable</span>
                                                                    <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-8 flex gap-4">
                                                        <button 
                                                            onClick={() => startEdit(order)} 
                                                            className="flex-1 bg-text-main text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition flex items-center justify-center gap-2 group/edit"
                                                        >
                                                            <Edit3 size={16} className="group-hover/edit:rotate-12 transition-transform" /> 
                                                            Modify Order
                                                        </button>
                                                        <button 
                                                            onClick={async () => { if (window.confirm('Archive this order? This action cannot be undone.')) { await api.delete(`/orders/${order.id}`); fetchInitialData(); } }} 
                                                            className="px-6 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition"
                                                            title="Delete Order"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {orders.length === 0 && (
                                     <div className="card-premium py-20 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-primary mb-6">
                                            <ShoppingBag size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black text-text-main tracking-tight">No orders yet</h3>
                                        <p className="text-text-muted font-medium mt-2 max-w-xs">Your order history is empty. Start by placing a new order using the form.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}