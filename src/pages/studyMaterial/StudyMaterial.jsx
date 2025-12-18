import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Search, Filter, Lock, Unlock, Download, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getStudyNotesSlice } from '../../redux/freeTestSlice';

const StudyMaterial = () => {
    const dispatch = useDispatch();
    const [studyNotes, setStudyNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1
    });

    const [filterCategory, setFilterCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [isPaidFilter, setIsPaidFilter] = useState(false);

    const fetchStudyNotes = async (page = 1) => {
        setLoading(true);
        try {
            const res = await dispatch(getStudyNotesSlice({ page })).unwrap();
            if (res && res.data) {
                setStudyNotes(res.data.data || []);
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page
                });
            }
        } catch (error) {
            console.error("Failed to fetch study notes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyNotes(1);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchStudyNotes(newPage);
        }
    };

    // Filter Logic
    const filteredProducts = studyNotes.filter(product => {
        if (filterCategory !== "All" && product.category) {
            return product.category === filterCategory;
        }

        const isFree = product.type === "free" || product.price == 0;
        if (isPaidFilter && isFree) return false;

        return true;
    });

    const addToCart = (product) => {
        if (!cart.find(c => c.id === product.id)) {
            setCart([...cart, product]);
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + Number(item.price), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Unlock Knowledge: Premium Study Guides</h2>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                        <div className="flex flex-wrap gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                            <button
                                onClick={() => setIsPaidFilter(!isPaidFilter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${isPaidFilter ? 'bg-blue-100 text-blue-700' : 'bg-white border hover:bg-gray-50'}`}
                            >
                                Paid
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {["All", "Math", "Science", "History"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filterCategory === cat
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => {
                                        const isFree = product.type === "free" || product.price == 0;
                                        return (
                                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                                                <div className="relative p-6 pb-0">
                                                    {/* Badge */}
                                                    <span className={`absolute z-10 top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${isFree ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
                                                        }`}>
                                                        {isFree ? "FREE" : `₹${product.price}`}
                                                    </span>

                                                    {/* Image */}
                                                    <div className={`aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 relative`}>
                                                        <img
                                                            src={product.cover_image || "https://placehold.co/400x300/e2e8f0/1e293b?text=Study+Material"}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="px-6 pb-6">
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{product.title}</h3>
                                                    {/* <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description || product.subject?.title || "Comprehensive study guide"}</p> */}

                                                    {isFree ? (
                                                        <a
                                                            href={product.file_path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2.5 px-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition flex justify-center items-center gap-2"
                                                        >
                                                            <Download className="w-4 h-4" /> Download PDF
                                                        </a>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition flex justify-center items-center gap-2"
                                                        >
                                                            <Unlock className="w-4 h-4" /> Unlock Access
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-12 text-gray-400">
                                        <button
                                            onClick={() => handlePageChange(pagination.current_page - 1)}
                                            disabled={pagination.current_page === 1}
                                            className="hover:text-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <span className="text-gray-900 font-medium">
                                            {pagination.current_page} / {pagination.last_page}
                                        </span>

                                        <button
                                            onClick={() => handlePageChange(pagination.current_page + 1)}
                                            disabled={pagination.current_page === pagination.last_page}
                                            className="hover:text-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar / Cart Summary */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Purchase Summary</h3>

                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                                            {/* <p className="text-xs text-gray-400">Organic Chemistry Notes</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax:</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 text-lg font-bold mt-2 pt-2 border-t border-gray-50">
                                    <span>TOTAL:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 shadow-lg shadow-blue-900/20 transition-all transform active:scale-95">
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default StudyMaterial