import { useState } from "react";
import api from "../api/axios";
import { Plus, Tag, DollarSign } from "lucide-react";

export default function CreateProduct({ refreshProducts }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/products", { name, price });
            setName("");
            setPrice("");
            refreshProducts();
        } catch (err) {
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-premium mb-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform hover:scale-110 duration-700"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                        Add New Product
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-6 space-y-2">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Product Name</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="E.g. Premium Coffee Beans"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-premium pl-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Price (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="number"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="input-premium pl-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <button
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 h-[54px]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    <span>Create Product</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}