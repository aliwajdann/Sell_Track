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
    Tag,
    MoreVertical
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
            
            <main className="max-w-7xl mx-auto pt-24 pb-20 px-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                            <ShoppingBag className="text-primary" size={28} />
                            Products
                        </h1>
                        <p className="text-text-secondary mt-1">Manage your inventory and pricing.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Total Products</p>
                            <p className="text-2xl font-bold text-text-main">{products.length}</p>
                        </div>
                    </div>
                    <div className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Active Status</p>
                            <p className="text-2xl font-bold text-text-main">98%</p>
                        </div>
                    </div>
                    <div className="card flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Avg Price</p>
                            <p className="text-2xl font-bold text-text-main">
                                ${products.length > 0 
                                    ? (products.reduce((acc, p) => acc + Number(p.price), 0) / products.length).toFixed(2) 
                                    : "0.00"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Create Product Form */}
                    <div className="lg:col-span-4">
                        <CreateProduct refreshProducts={getProducts} />
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-8">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Product Info</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-text-secondary">Loading products...</td>
                                        </tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-text-secondary">No products found.</td>
                                        </tr>
                                    ) : filteredProducts.map((product) => (
                                        <tr key={product.id} className="group">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-bg-main flex items-center justify-center text-text-secondary border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                                                        <Tag size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-text-main">{product.name}</p>
                                                        <p className="text-xs text-text-secondary">ID: {product.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="font-bold text-text-main">${Number(product.price).toFixed(2)}</span>
                                            </td>
                                            <td>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    Active
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-text-secondary hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-text-main/20 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                        <div className="card w-full max-w-md relative z-10 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Edit Product</h3>
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-bg-main rounded-lg transition-colors text-text-secondary">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Product Name</label>
                                    <input 
                                        type="text" required className="input"
                                        value={currentProduct.name}
                                        onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1.5 block">Price ($)</label>
                                    <input 
                                        type="number" step="0.01" required className="input"
                                        value={currentProduct.price}
                                        onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary flex-1">
                                        <Save size={18} className="mr-2" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}