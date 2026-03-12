import { useState } from "react";
import api from "../api/axios";
import { Plus, Tag, DollarSign, PackagePlus } from "lucide-react";

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
        <div className="card sticky top-24 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-500"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <PackagePlus size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-text-main">
                        New Product
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Product Name</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <input
                                type="text"
                                placeholder="E.g. Premium Coffee"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block ml-1">Price (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="input pl-10"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>Add Product</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}