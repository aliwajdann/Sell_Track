import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import CreateProduct from "../components/CreateProduct.jsx";
import { 
    Edit2, 
    Trash2, 
    Package, 
    TrendingUp, 
    DollarSign, 
    X, 
    Save, 
    Search,
    ShoppingBag,
    Tag
} from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State for Modal/Dialogue
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', price: '' });

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                getProducts();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${currentProduct.id}`, {
                name: currentProduct.name,
                price: currentProduct.price
            });
            setIsEditing(false);
            getProducts();
        } catch (err) {
            alert("Update failed");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-main font-inter">
            <Navbar />
            
            <main className="max-w-7xl mx-auto pt-28 pb-20 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                                Inventory
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight flex items-center gap-3 font-sora">
                            <ShoppingBag className="text-primary" size={32} />
                            Product Catalog
                        </h1>
                        <p className="text-text-muted mt-2 font-medium">Manage your products, pricing and inventory levels.</p>
                    </div>

                    <div className="flex items-center gap-4">
                         <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-premium pl-12 w-full md:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card-premium p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                            <Package size={28} />
                        </div>
                        <div>
                            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Total Products</p>
                            <p className="text-2xl font-black text-text-main leading-none mt-1">{products.length}</p>
                        </div>
                    </div>
                    <div className="card-premium p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Active Status</p>
                            <p className="text-2xl font-black text-text-main leading-none mt-1">98%</p>
                        </div>
                    </div>
                    <div className="card-premium p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Avg Price</p>
                            <p className="text-2xl font-black text-text-main leading-none mt-1">
                                ${products.length > 0 
                                    ? (products.reduce((acc, p) => acc + Number(p.price), 0) / products.length).toFixed(2) 
                                    : "0.00"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <CreateProduct refreshProducts={getProducts} />

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card-premium h-64 animate-pulse border-none bg-gray-200/50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="card-premium group relative">
                                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition shadow-xl cursor-pointer"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-xl cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-500">
                                        <Package size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-text-main tracking-tight leading-tight mb-1 font-sora">
                                        {product.name}
                                    </h2>
                                    <p className="text-text-muted font-bold text-[10px] uppercase tracking-[0.15em]"> SKU: PROD-{product.id.toString().slice(-4)}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
                                    <div>
                                        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Unit Price</p>
                                        <p className="text-2xl font-black text-text-main leading-none">
                                            <span className="text-primary">$</span>{product.price}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        In Stock
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-primary mb-6">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-text-main tracking-tight font-sora">No products found</h3>
                                <p className="text-text-muted font-medium mt-2 max-w-xs">Try adjusting your search terms or add a new product to your catalog.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- Edit Modal --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-text-main/20 backdrop-blur-md flex items-center justify-center p-6 z-[60] transition-opacity">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-border">
                        <div className="px-10 py-8 border-b border-border bg-bg-main flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                                    <Edit2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-text-main tracking-tight font-sora">Edit Product</h2>
                                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Product ID: #{currentProduct.id.toString().slice(0, 8)}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-muted hover:text-text-main hover:shadow-md transition cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted ml-1 uppercase tracking-widest">Product Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        className="input-premium pl-12"
                                        value={currentProduct.name}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted ml-1 uppercase tracking-widest">Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="number"
                                        className="input-premium pl-12"
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary flex-1 cursor-pointer"
                                >
                                    Discard Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}