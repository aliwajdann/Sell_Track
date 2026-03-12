import { useEffect, useState } from "react";
import api from "../api/axios";
import { User, Phone, Mail, MapPin, Package, ShoppingCart, Plus } from "lucide-react";

export default function CreateOrder() {
    const [products, setProducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [address, setAddress] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/orders", {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_address: address,
                items: [{ product_id: productId, quantity }]
            });
            alert("Order created successfully!");
            setCustomerName(""); setCustomerPhone(""); setCustomerEmail(""); setAddress(""); setQuantity(1); setProductId("");
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Failed to create order");
        } finally { setLoading(false); }
    };

    return (
        <div className="card shadow-xl shadow-text-main/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingCart size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-main">Quick Order</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Customer</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            placeholder="Full Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="input pl-10" required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            placeholder="Phone"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="input pl-10" required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                        <input
                            placeholder="Email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-text-secondary" size={16} />
                    <textarea
                        placeholder="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input pl-10 min-h-[80px]" required
                    />
                </div>

                <div className="pt-4 border-t border-border">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <select
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                className="input pl-10 appearance-none" required
                            >
                                <option value="">Product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <input
                            type="number" min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="input w-20" required
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="btn-primary w-full mt-2"
                >
                    {loading ? "Creating..." : "Create Order"}
                </button>
            </form>
        </div>
    );
}