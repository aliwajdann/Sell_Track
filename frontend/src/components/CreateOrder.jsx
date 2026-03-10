import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CreateOrder() {

    const [products, setProducts] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [address, setAddress] = useState("");

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await api.post("/orders", {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_address: address,
                items: [
                    {
                        product_id: productId,
                        quantity
                    }
                ]
            });

            alert("Order created");

            setCustomerName("");
            setCustomerPhone("");
            setCustomerEmail("");
            setAddress("");
            setQuantity(1);

        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow"
        >

            <h2 className="text-xl font-bold mb-4">
                Create Order
            </h2>

            <input
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border p-2 w-full mb-3 rounded"
            />

            <input
                placeholder="Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="border p-2 w-full mb-3 rounded"
            />

            <input
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="border p-2 w-full mb-3 rounded"
            />

            <input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
            />

            <select
                onChange={(e) => setProductId(e.target.value)}
                className="border p-2 w-full mb-3 rounded"
            >
                <option>Select product</option>

                {products.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}

            </select>

            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
            />

            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Create Order
            </button>

        </form>
    );
}