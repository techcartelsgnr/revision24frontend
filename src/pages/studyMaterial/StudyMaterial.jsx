import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Search, Filter, Lock, Unlock, Download, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
    getStudyNotesSlice,
    getStudyNoteDetailsSlice,
    purchaseStudyMaterialSlice,
    paymentVerifyStudyNoteSlice,
    paymentCancelStudyNoteSlice
} from '../../redux/freeTestSlice';
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';

const StudyMaterial = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.home);
    const [studyNotes, setStudyNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1
    });

    const [filterCategory, setFilterCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [isPaidFilter, setIsPaidFilter] = useState(false);

    // PDF Viewer State
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [viewingPdf, setViewingPdf] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState({});
    const [isWindowBlurred, setIsWindowBlurred] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    const handleViewDetails = async (id) => {
        setDetailsLoading(prev => ({ ...prev, [id]: true }));
        try {
            const res = await dispatch(getStudyNoteDetailsSlice(id)).unwrap();
            if (res && res.data && res.data[0]) {
                setViewingPdf(res.data[0]);
                setShowPdfModal(true);
            }
        } catch (error) {
            console.error("Failed to fetch study note details:", error);
            toast.error("Failed to load PDF details");
        } finally {
            setDetailsLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        const handleSecurity = (e) => {
            if (!showPdfModal) return;

            // Block common screenshot and devtools shortcuts (cross-platform codes)
            if (
                e.code === 'PrintScreen' ||
                (e.metaKey && e.shiftKey && (e.code === 'Digit3' || e.code === 'Digit4' || e.code === 'Digit5')) || // Mac Screenshot
                (e.ctrlKey && e.shiftKey && (e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC' || e.code === 'KeyS')) || // DevTools/Snipping
                (e.ctrlKey && e.code === 'KeyU') || // View Source
                (e.metaKey && e.altKey && e.code === 'KeyI') // Mac DevTools
            ) {
                e.preventDefault();
                return false;
            }
        };

        const handleContextMenu = (e) => {
            if (showPdfModal) {
                e.preventDefault();
                return false;
            }
        };

        const handleBlur = () => {
            if (showPdfModal) setIsWindowBlurred(true);
        };

        const handleFocus = () => {
            if (showPdfModal) setIsWindowBlurred(false);
        };

        if (showPdfModal) {
            window.addEventListener('keydown', handleSecurity);
            window.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('blur', handleBlur);
            window.addEventListener('focus', handleFocus);
            // Hide scrollbar when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleSecurity);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.body.style.overflow = 'auto';
            setIsWindowBlurred(false);
        };
    }, [showPdfModal]);

    useEffect(() => {
        fetchStudyNotes(1);
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchStudyNotes(newPage);
        }
    };

    // Extract dynamic categories from studyNotes
    const categories = ["All", ...new Set(studyNotes.map(product =>
        product.selected_subjects?.[0]?.category?.title
    ).filter(Boolean))];

    // Filter Logic
    const filteredProducts = studyNotes.filter(product => {
        const productCategory = product.selected_subjects?.[0]?.category?.title;

        if (filterCategory !== "All") {
            if (productCategory !== filterCategory) return false;
        }

        const isFree = product.type === "free" || Number(product.price) === 0;
        if (isPaidFilter && isFree) return false;

        return true;
    });

    const addToCart = (product) => {
        if (!cart.find(c => c.id === product.id)) {
            setCart([...cart, product]);
        }
    };

    // GST Update: Change tax calculation to 18% GST and total to reflect that.
    const subtotal = cart.reduce((acc, item) => acc + Number(item.price), 0);
    const taxRate = 0.18;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Load Razorpay SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const handleProceedToPayment = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        try {
            // Process each item in cart (assuming single purchase for now as per user request example)
            // If the backend supports multiple, this would change, but I'll follow the requested body format.
            for (const item of cart) {
                const basePrice = parseFloat(item.price);

                const paymentData = {
                    study_material_id: item.id.toString(),
                    amount: basePrice.toString(), // Price without GST as requested
                    platform: 'web',
                };

                console.log('💰 Purchasing Study Material:', paymentData);

                // Step 1: Get payment session (Razorpay Order)
                const res = await dispatch(purchaseStudyMaterialSlice(paymentData)).unwrap();
                console.log('✅ Backend Response:', res);

                if (!res.payment_session_id) {
                    throw new Error(res.message || 'Invalid payment session.');
                }

                // Step 2: Open Razorpay
                const razorpayResponse = await openRazorpay({
                    keyId: res.key_id,
                    amount: res.amount, // Backend usually calculates total with GST and sends here
                    orderId: res.payment_session_id,
                    name: item.title,
                    email: userInfo?.user?.email || userInfo?.email || '',
                    phone: userInfo?.user?.phone || userInfo?.phone || '',
                });
                console.log('✅ Razorpay Response:', razorpayResponse.orderId);
                // Step 3: Verify payment
                // ✅ CORRECT
                if (razorpayResponse?.razorpay_payment_id) {
                    await verifyPayment({
                        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                        razorpay_order_id: razorpayResponse.razorpay_order_id,
                        razorpay_signature: razorpayResponse.razorpay_signature,
                        platform: 'web',
                    });
                }
            }

            // Clear cart after all processed (if applicable)
            // Assuming the individual verify calls handle success messaging
        } catch (error) {
            console.error("❌ Checkout Error:", error);
            toast.error(error?.message || "Payment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const openRazorpay = (response) => {
        return new Promise((resolve, reject) => {
            if (!window.Razorpay) {
                reject(new Error('Razorpay SDK not loaded'));
                return;
            }

            const options = {
                key: response.keyId,
                amount: response.amount * 100, // INR to paise
                currency: "INR",
                order_id: response.orderId,
                name: "Revision24",
                description: response.name || "Study Material Purchase",
                image: "https://revision24.com/logo.jpeg",
                prefill: {
                    name: userInfo?.user?.name || userInfo?.name || "",
                    email: response.email || "",
                    contact: response.phone || "",
                },
                theme: {
                    color: "#2563eb",
                },
                handler: function (paymentResponse) {
                    console.log("✅ Payment Success:", paymentResponse);
                    resolve(paymentResponse);
                },
                modal: {
                    ondismiss: function () {
                        // Notify backend about cancellation
                        dispatch(paymentCancelStudyNoteSlice({
                            razorpay_order_id: response.orderId,
                            reason: 'user_cancelled',
                            payment_status: 'cancelled',
                            platform: 'web'
                        }));
                        console.log("❌ Payment cancelled", response);
                        reject(new Error("Payment cancelled"));
                    },
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (err) {
                console.error("❌ Payment Failed:", err.error);
                reject(err.error);
            });
            rzp1.open();
        });
    };

    const verifyPayment = async (payload) => {
        try {
            const response = await dispatch(paymentVerifyStudyNoteSlice(payload)).unwrap();
            if (response.status === 200) {
                toast.success("Purchase Successful!");
                setCart([]); // Clear cart on success
                // Optionally refetch study notes to update purchase status
                fetchStudyNotes(pagination.current_page);
            } else {
                toast.error(response.message || "Verification failed");
            }
        } catch (error) {
            toast.error("Verification failed. Please contact support.");
        }
    };

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
                        {categories.map(cat => (
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
                                        const isFree = product.type === "free" || Number(product.price) === 0;
                                        const isPurchased = product.is_purchased === "true";
                                        const canView = isFree || isPurchased;
                                        const categoryTitle = product.selected_subjects?.[0]?.category?.title || "General";

                                        return (
                                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                                                <div className="relative p-6 pb-0">
                                                    {/* Badge */}
                                                    <span className={`absolute z-10 top-4 right-4 px-3 py-1 text-xs font-bold rounded-full ${isFree ? "bg-green-100 text-green-700" : isPurchased ? "bg-blue-100 text-blue-700" : "bg-blue-600 text-white"
                                                        }`}>
                                                        {isFree ? "FREE" : isPurchased ? "PURCHASED" : `₹${product.price}`}
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
                                                    <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">{categoryTitle}</div>
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 line-clamp-2">{product.title}</h3>

                                                    {canView ? (
                                                        <button
                                                            onClick={() => handleViewDetails(product.id)}
                                                            disabled={detailsLoading[product.id]}
                                                            className="w-full py-2.5 px-4 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition flex justify-center items-center gap-2 disabled:opacity-50"
                                                        >
                                                            {detailsLoading[product.id] ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Search className="w-4 h-4" />
                                                            )}
                                                            <span>{detailsLoading[product.id] ? "Loading..." : "View Material"}</span>
                                                        </button>
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
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST:</span>
                                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-900 text-lg font-bold mt-2 pt-2 border-t border-gray-50">
                                    <span>TOTAL:</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                disabled={cart.length === 0 || isProcessing}
                                className={`w-full mt-6 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed`}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>PROCESSING...</span>
                                    </div>
                                ) : (
                                    "PROCEED TO CHECKOUT"
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* PDF Viewer Modal */}
            {showPdfModal && viewingPdf && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                >
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{viewingPdf.title}</h3>
                                <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                                    {viewingPdf.selected_subjects?.[0]?.category?.title || "General Study Material"}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowPdfModal(false)}
                                    className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition px-4 flex items-center gap-2"
                                >
                                    <span className="text-sm font-bold">CLOSE</span>
                                    <ChevronLeft className="w-5 h-5 rotate-180" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - PDF Iframe */}
                        <div className="flex-1 bg-gray-100 relative overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
                            <iframe
                                src={`${viewingPdf.file_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                className={`w-full h-full border-none transition-all duration-300 ${isWindowBlurred ? 'filter blur-2xl opacity-50' : ''}`}
                                title={viewingPdf.title}
                            />

                            {/* Blur Overlay Message */}
                            {isWindowBlurred && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
                                    <Lock className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-medium text-center px-6">
                                        Content hidden for security purposes.<br />
                                        <span className="text-sm text-gray-400">Please return to the window to view.</span>
                                    </p>
                                </div>
                            )}

                            {/* Transparent Shield to prevent right-click and selection inside iframe if browser allows */}
                            <div className="absolute inset-0 z-10 pointer-events-none border-t border-gray-200 shadow-inner"></div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                            <span>Previewing material...</span>
                            <button
                                onClick={() => setShowPdfModal(false)}
                                className="font-bold text-blue-600 hover:text-blue-700"
                            >
                                CLOSE PREVIEW
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudyMaterial