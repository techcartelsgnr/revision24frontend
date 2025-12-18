// import { Menu, X } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutSlice } from '../redux/authSlice';
// import { useEffect, useState } from 'react';
// import { IoMdHome } from 'react-icons/io';
// import { clearUserData } from '../helpers/userStorage';
// import { MdDashboard } from 'react-icons/md';
// import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
// import { sidebarToggle } from '../redux/globleSlice';

// const Header = () => {
//   const dispatch = useDispatch();
//   const nav = useNavigate();
//   const [logoutLoading, setLogoutLoading] = useState(false);
//   const [auth, setAuth] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const { isSideBar } = useSelector(state => state.toggleSlice)
//   const handleLogout = async () => {
//     try {
//       setLogoutLoading(true);
//       const res = await dispatch(logoutSlice()).unwrap();
//       await clearUserData();
//       nav('/login');
//       showSuccessToast(res.message)
//     } catch (error) {
//       await clearUserData();
//       nav('/login');
//       showErrorToast(res.message)
//     } finally {
//       setLogoutLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const result = await isAuthenticated();
//       setAuth(result);
//     };
//     checkAuth();
//   }, []);

//   const toggleSidebar = () => {
//     dispatch(sidebarToggle())

//   }






//   return (
//     <header className="bg-white shadow-md w-full px-4 py-3 md:px-6  relative">
//       <div className="flex justify-between items-center">
//         {/* Left Side: Logo + Nav */}
//         <div className="flex items-center gap-4">
//           {/* Mobile Menu Button */}
//           <button onClick={() => {
//             // setMenuOpen(!menuOpen)
//             toggleSidebar()
//           }} className="md:hidden text-gray-700 cursor-pointer">
//             {isSideBar ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           {/* Logo */}
//           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav('/')}>
//             <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
//             <span className="text-sky-500 text-xs md:text-sm lg:text-xl font-bold">Revision24</span>

//           </div>

//           {/* Desktop Nav */}
//           {auth && (
//             <div className="hidden md:flex gap-4 items-center text-gray-700 font-medium ml-6">
//               {/* <Link to="/" className="hover:text-sky-600">Home</Link> */}
//               {/* <Link to="/user-dashboard" className="hover:text-sky-600"> User Dashboard</Link> */}

//             </div>
//           )}
//         </div>

//         {/* Right Side: Subscription + Buttons */}
//         {/* <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
//           <Link to="/subscription">
//             <img
//               src="/plain-icon.png"
//               alt="icon"
//               className="h-8 sm:h-10 md:h-14 object-cover"
//             />
//           </Link>

//           {auth ? (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
//             >
//               {logoutLoading ? 'Please wait' : 'Log out'}
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => nav('/login')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => nav('/register')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold"
//               >
//                 Sign Up
//               </button>
//             </>
//           )}
//         </div> */}
//       </div>

//       {/* Mobile Nav (Visible only in mobile) */}
//       {/* {menuOpen && (
//         <nav className="block md:hidden mt-4 bg-white shadow rounded-md py-4 px-6 space-y-3 text-gray-700 text-base font-medium animate-slide-in">
//           <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
//             <IoMdHome /> Home
//           </Link>
//           {auth && (
//             <Link className='flex items-center gap-2' to="/user-dashboard" onClick={() => setMenuOpen(false)}>
//              <MdDashboard /> User Dashboard
//             </Link>
//           )}
//         </nav>
//       )} */}


//     </header>
//   );
// };

// export default Header;

// import { Menu, X } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutSlice } from '../redux/authSlice';
// import { useEffect, useState } from 'react';
// import { IoMdHome } from 'react-icons/io';
// import { clearUserData } from '../helpers/userStorage';
// import { MdDashboard } from 'react-icons/md';
// import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
// import { sidebarToggle } from '../redux/globleSlice';

// const Header = () => {
//   const dispatch = useDispatch();
//   const nav = useNavigate();
//   const [logoutLoading, setLogoutLoading] = useState(false);
//   const [auth, setAuth] = useState(false);

//   const { isSideBar } = useSelector(state => state.toggleSlice);

//   // ✅ Add console log to debug
//   console.log('isSideBar state:', isSideBar);

//   const handleLogout = async () => {
//     try {
//       setLogoutLoading(true);
//       const res = await dispatch(logoutSlice()).unwrap();
//       await clearUserData();
//       nav('/login');
//       showSuccessToast(res.message);
//     } catch (error) {
//       await clearUserData();
//       nav('/login');
//       showErrorToast(error?.message || 'Logout failed');
//     } finally {
//       setLogoutLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const result = await isAuthenticated();
//       setAuth(result);
//       console.log('Auth status:', result);
//     };
//     checkAuth();
//   }, []);

//   const toggleSidebar = () => {
//     console.log('Toggle clicked, current state:', isSideBar);
//     dispatch(sidebarToggle());
//   };

//   return (
//     <header className="bg-white shadow-md w-full px-4 py-3 md:px-6 relative z-50">
//       <div className="flex justify-between items-center">
//         {/* Left Side: Logo + Nav */}
//         <div className="flex items-center gap-4">
//           {/* Mobile Menu Button */}
//           <button 
//             onClick={toggleSidebar} 
//             className="md:hidden text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//             aria-label="Toggle menu"
//           >
//             {isSideBar ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           {/* Logo */}
//           <div 
//             className="flex items-center space-x-2 cursor-pointer" 
//             onClick={() => nav('/')}
//           >
//             <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
//             <span className="text-sky-500 text-xs md:text-sm lg:text-xl font-bold">
//               Revision24
//             </span>
//           </div>

//           {/* Desktop Nav */}
//           {auth && (
//             <div className="hidden md:flex gap-4 items-center text-gray-700 font-medium ml-6">
//               <Link to="/" className="hover:text-sky-600 transition-colors">
//                 Home
//               </Link>
//               <Link to="/user-dashboard" className="hover:text-sky-600 transition-colors">
//                 User Dashboard
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Right Side: Subscription + Buttons */}
//         <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
//           <Link to="/subscription">
//             <img
//               src="/plain-icon.png"
//               alt="icon"
//               className="h-8 sm:h-10 md:h-14 object-cover hover:scale-105 transition-transform"
//             />
//           </Link>

//           {auth ? (
//             <button
//               onClick={handleLogout}
//               disabled={logoutLoading}
//               className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
//             >
//               {logoutLoading ? 'Please wait...' : 'Log out'}
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => nav('/login')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => nav('/register')}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
//               >
//                 Sign Up
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ✅ Mobile Nav - Conditional Rendering */}
//       {isSideBar && (
//         <div className="md:hidden mt-4 bg-white shadow-lg rounded-lg py-4 px-4 space-y-2 border border-gray-200">
//           <Link 
//             to="/" 
//             className="flex items-center gap-3 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors" 
//             onClick={toggleSidebar}
//           >
//             <IoMdHome size={20} className="text-sky-600" />
//             <span>Home</span>
//           </Link>

//           {auth && (
//             <>
//               <Link 
//                 to="/user-dashboard" 
//                 className="flex items-center gap-3 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors" 
//                 onClick={toggleSidebar}
//               >
//                 <MdDashboard size={20} className="text-sky-600" />
//                 <span>User Dashboard</span>
//               </Link>

//               <Link 
//                 to="/subscription" 
//                 className="flex items-center gap-3 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors" 
//                 onClick={toggleSidebar}
//               >
//                 <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span>Subscription</span>
//               </Link>

//               <Link 
//                 to="/practice-batch" 
//                 className="flex items-center gap-3 hover:bg-gray-100 rounded-md px-3 py-2 transition-colors" 
//                 onClick={toggleSidebar}
//               >
//                 <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                 </svg>
//                 <span>Practice Batches</span>
//               </Link>

//               <div className="border-t my-2"></div>

//               <button
//                 onClick={() => {
//                   handleLogout();
//                   toggleSidebar();
//                 }}
//                 disabled={logoutLoading}
//                 className="flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-md px-3 py-2 w-full text-left transition-colors disabled:opacity-50"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
//               </button>
//             </>
//           )}

//           {!auth && (
//             <div className="space-y-2 pt-2">
//               <button
//                 onClick={() => {
//                   nav('/login');
//                   toggleSidebar();
//                 }}
//                 className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition-colors"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => {
//                   nav('/register');
//                   toggleSidebar();
//                 }}
//                 className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-full transition-colors"
//               >
//                 Sign Up
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;



// import { Menu, X } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';
// import { useDispatch, useSelector } from 'react-redux';
// import { logoutSlice } from '../redux/authSlice';
// import { useEffect, useState } from 'react';
// import { IoMdHome } from 'react-icons/io';
// import { clearUserData } from '../helpers/userStorage';
// import { MdDashboard } from 'react-icons/md';
// import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
// import { sidebarToggle } from '../redux/globleSlice';

// const Header = () => {
//   const dispatch = useDispatch();
//   const nav = useNavigate();
//   const [logoutLoading, setLogoutLoading] = useState(false);
//   const [auth, setAuth] = useState(false);

//   const { isSideBar } = useSelector(state => state.toggleSlice);

//   const handleLogout = async () => {
//     try {
//       setLogoutLoading(true);
//       const res = await dispatch(logoutSlice()).unwrap();
//       await clearUserData();
//       nav('/login');
//       showSuccessToast(res.message);
//     } catch (error) {
//       await clearUserData();
//       nav('/login');
//       showErrorToast(error?.message || 'Logout failed');
//     } finally {
//       setLogoutLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const result = await isAuthenticated();
//       setAuth(result);
//     };
//     checkAuth();
//   }, []);

//   const toggleSidebar = () => {
//     dispatch(sidebarToggle());
//   };

//   return (
//     <>
//       <header className="bg-white shadow-md w-full px-4 py-3 md:px-6 relative z-30">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={toggleSidebar} 
//               className="md:hidden text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//             >
//               {isSideBar ? <X size={24} /> : <Menu size={24} />}
//             </button>

//             <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav('/')}>
//               <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
//               <span className="text-sky-500 text-xs md:text-sm lg:text-xl font-bold">
//                 Revision24
//               </span>
//             </div>

//             {auth && (
//               <div className="hidden md:flex gap-4 items-center text-gray-700 font-medium ml-6">
//                 <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
//                 <Link to="/user-dashboard" className="hover:text-sky-600 transition-colors">User Dashboard</Link>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
//             <Link to="/subscription">
//               <img src="/plain-icon.png" alt="icon" className="h-8 sm:h-10 md:h-14 object-cover" />
//             </Link>

//             {auth ? (
//               <button
//                 onClick={handleLogout}
//                 disabled={logoutLoading}
//                 className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold disabled:opacity-50"
//               >
//                 {logoutLoading ? 'Please wait...' : 'Log out'}
//               </button>
//             ) : (
//               <>
//                 <button onClick={() => nav('/login')} className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold">
//                   Sign In
//                 </button>
//                 <button onClick={() => nav('/register')} className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold">
//                   Sign Up
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* ✅ Mobile Menu WITHOUT duplicate header */}
//       {isSideBar && (
//         <>
//           {/* Overlay */}
//           <div 
//             className="fixed inset-0 bg-black/50 md:hidden" 
//             style={{ zIndex: 9998 }}
//             onClick={toggleSidebar}
//           />

//           {/* ✅ Sidebar - No header, just close button and menu */}
//           <div 
//             className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl md:hidden overflow-y-auto"
//             style={{ zIndex: 9999 }}
//           >
//             {/* ✅ Simple close button at top-right */}
//             <div className="flex justify-end p-4 border-b">
//               <button 
//                 onClick={toggleSidebar} 
//                 className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             {/* ✅ Menu Items - Clean and simple */}
//             <nav className="p-4 space-y-1">
//               <Link 
//                 to="/" 
//                 className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-4 py-3 text-gray-700 font-medium transition-colors" 
//                 onClick={toggleSidebar}
//               >
//                 <IoMdHome size={22} className="text-sky-600" />
//                 <span>Home</span>
//               </Link>

//               {auth && (
//                 <>
//                   <Link 
//                     to="/user-dashboard" 
//                     className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-4 py-3 text-gray-700 font-medium transition-colors" 
//                     onClick={toggleSidebar}
//                   >
//                     <MdDashboard size={22} className="text-sky-600" />
//                     <span>User Dashboard</span>
//                   </Link>

//                   <Link 
//                     to="/subscription" 
//                     className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-4 py-3 text-gray-700 font-medium transition-colors" 
//                     onClick={toggleSidebar}
//                   >
//                     <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <span>Subscription</span>
//                   </Link>

//                   <div className="border-t my-3"></div>

//                   <button
//                     onClick={() => { handleLogout(); toggleSidebar(); }}
//                     disabled={logoutLoading}
//                     className="flex items-center gap-3 text-red-500 hover:bg-red-50 rounded-lg px-4 py-3 w-full text-left font-medium disabled:opacity-50 transition-colors"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                     </svg>
//                     <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
//                   </button>
//                 </>
//               )}

//               {!auth && (
//                 <div className="space-y-3 pt-3">
//                   <button 
//                     onClick={() => { nav('/login'); toggleSidebar(); }} 
//                     className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg w-full font-semibold transition-colors"
//                   >
//                     Sign In
//                   </button>
//                   <button 
//                     onClick={() => { nav('/register'); toggleSidebar(); }} 
//                     className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg w-full font-semibold transition-colors"
//                   >
//                     Sign Up
//                   </button>
//                 </div>
//               )}
//             </nav>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Header;


import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSlice } from '../redux/authSlice';
import { useEffect, useState } from 'react';
import { clearUserData } from '../helpers/userStorage';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
import { sidebarToggle } from '../redux/globleSlice';

const Header = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [auth, setAuth] = useState(false);

  const { isSideBar } = useSelector(state => state.toggleSlice);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const res = await dispatch(logoutSlice()).unwrap();
      await clearUserData();
      nav('/login');
      showSuccessToast(res.message);
    } catch (error) {
      await clearUserData();
      nav('/login');
      showErrorToast(error?.message || 'Logout failed');
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuth(result);
    };
    checkAuth();
  }, []);

  const toggleSidebar = () => {
    dispatch(sidebarToggle());
  };

  return (
    <header className="bg-white shadow-md w-full px-4 py-3 md:px-6 relative z-30">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* ✅ Just menu button, no sidebar here */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            {isSideBar ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => nav('/')}>
            <img src="/logo.jpeg" alt="Logo" className="w-6 h-6" />
            <span className="text-sky-500 text-xs md:text-sm lg:text-xl font-bold">
              Revision24
            </span>
          </div>

          {/* {auth && (
            <div className="hidden md:flex gap-4 items-center text-gray-700 font-medium ml-6">
              <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
              <Link to="/user-dashboard" className="hover:text-sky-600 transition-colors">User Dashboard</Link>
            </div>
          )} */}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <Link to="/subscription">
            <img src="/plain-icon.png" alt="icon" className="h-8 sm:h-10 md:h-14 object-cover" />
          </Link>

          {auth ? (
            // <button
            //   onClick={handleLogout}
            //   disabled={logoutLoading}
            //   className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold disabled:opacity-50"
            // >
            //   {logoutLoading ? 'Please wait...' : 'Log out'}
            // </button>
            ''
          ) : (
            <>
              <button onClick={() => nav('/login')} className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold">
                Sign In
              </button>
              <button onClick={() => nav('/register')} className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
