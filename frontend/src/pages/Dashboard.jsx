import Navbar from "../components/Navbar";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <section className="pt-12 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
                        Order Management Simplified
                    </span>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tighter">
                        Master your sales <br />
                        <span className="text-transparent bg-clip-text  from-indigo-600 to-blue-500">
                            in a single click.
                        </span>
                    </h1>

                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ultimate dashboard for modern sellers. Manage products, track orders,
                        and scale your business without the headache of spreadsheets.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            // onClick={ }
                            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300"
                        >
                            Start Free Now
                        </button>
                        <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition">
                            View Demo
                        </button>
                    </div>

                    {/* Floating Stats or Social Proof */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-10">
                        <div>
                            <p className="text-2xl font-black text-gray-900">10k+</p>
                            <p className="text-sm text-gray-400 font-medium">Orders Processed</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">99.9%</p>
                            <p className="text-sm text-gray-400 font-medium">Uptime Reliable</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">24/7</p>
                            <p className="text-sm text-gray-400 font-medium">Expert Support</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">Free</p>
                            <p className="text-sm text-gray-400 font-medium">Forever Plan</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}