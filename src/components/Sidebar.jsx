import { Link, NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  GraduationCap,
  Calendar,
  FileText,
  RefreshCcw,
  HelpCircle,
  CheckCircle,
  Award,
  Calculator,
  User2,
  BadgeIndianRupee,
  LucideSave,
  HelpCircleIcon,
  Settings,
  X,
  Menu,
  Home,
  Newspaper,
  BookOpenCheck,
  SquarePlay,
  LogOut,
  Loader2,
  Crown,
  Sparkles,
  Star,
  NotebookPen,
  CircleQuestionMark,
  WalletCards
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { clearUserData } from '../helpers/userStorage';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtil';
import { logoutSlice } from '../redux/authSlice';
import { sidebarToggle } from '../redux/globleSlice';

const Sidebar = () => {
  const nav = useNavigate();
  const { isSideBar } = useSelector((state) => state.toggleSlice);
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);

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
      showErrorToast(error.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  const menu = [
    {
      section: 'Dashboard',
      items: [
        { name: 'Home', icon: <Home size={18} />, path: '/' },
      ],
    },
    {
      section: 'LEARN',
      items: [
        { name: 'Live Classes', icon: <Calendar size={18} />, path: '/live-classes', badge: 'FREE' },
        { name: 'Current Affairs', icon: <Newspaper size={18} />, path: '/current-affairs', badge: 'FREE' },
        { name: 'Monthly Magazines', icon: <BookOpenCheck size={18} />, path: '/all-magazies', badge: '' },
        { name: 'Notes & PDFs', icon: <NotebookPen size={18} />, path: '/pdf-notes', badge: '' },
        { name: 'Study Material', icon: <NotebookPen size={18} />, path: '/study-material', badge: '' },
        { name: 'Practice Batch', icon: <SquarePlay size={18} />, path: '/all-batches', badge: '' },
      ],
    },
    {
      section: 'TESTS',
      items: [
        { name: 'Test Series', icon: <FileText size={18} />, path: '/test-series' },
        { name: 'Live Tests & Quizzes', icon: <Calendar size={18} />, path: '/live-quiz-test' },
        { name: 'Previous Year Papers', icon: <FileText size={18} />, path: '/previous-papers' },
        { name: 'Attempted Test', icon: <FileText size={18} />, path: '/attempted-test' },
        { name: 'Practice', icon: <RefreshCcw size={18} />, path: '/practice', badge: 'FREE' },
        { name: 'Free Quiz', icon: <CircleQuestionMark size={18} />, path: '/free-quizes', badge: 'FREE' },
        { name: 'GK & Current Affairs', icon: <RefreshCcw size={18} />, path: '/gk&ca-page', badge: '' },
        { name: 'Doubts', icon: <FileText size={18} />, path: '/doubts' },
        {
          name: 'Focus+',
          icon: <Crown size={18} />,
          path: '/subscription',
          badge: 'PREMIUM',
          isPremium: true
        },
        { name: 'Exams Blog', icon: <FileText size={18} />, path: '/blog' },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { name: 'My Profile', icon: <User2 size={18} />, path: '/user-dashboard' },
        { name: 'My Transactions', icon: <BadgeIndianRupee size={18} />, path: '/my-transaction' },
        { name: 'My Collection', icon: <LucideSave size={18} />, path: '/saved-items' },
        { name: 'Support', icon: <HelpCircleIcon size={18} />, path: '/help-support' },
        // { name: 'Refund Policy', icon: <WalletCards size={18} />, path: '/refund-policy' },
        { name: 'Settings', icon: <Settings size={18} />, path: '/setting' },
      ],
    },
  ];

  const toggleSidebar = () => {
    dispatch(sidebarToggle());
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSideBar && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "bg-white shadow-xl border-r border-gray-200 text-gray-800 w-80 h-screen overflow-hidden sidebar fixed top-0 left-0 z-50 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static flex flex-col",
          {
            "-translate-x-full": !isSideBar,
            "translate-x-0": isSideBar,
          }
        )}
      >
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
          {/* Close Button for Mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200 z-[999] border border-amber-600"
          >
            <X size={20} />
          </button>

          {/* Logo Section */}
          <Link to={'/'} onClick={() => window.innerWidth < 768 && toggleSidebar()}>
            <div className="p-3 flex items-center gap-3">
              <div className="relative">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="w-10 h-10 rounded-lg shadow-lg border-2 border-white border-opacity-20"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Revision24</h1>
                <p className="text-sm opacity-80">Ultimate Learning Platform</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menu.map((section) => (
            <div key={section.section} className="space-y-2">
              {/* Section Header */}
              {section.section !== 'Dashboard' && (
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {section.section}
                  </h3>
                  <div className="mt-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
              )}

              {/* Menu Items */}
              <ul className="space-y-1" >
                {section.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={() => window.innerWidth < 768 && toggleSidebar()}
                      className={({ isActive }) => {
                        // ✅ Special styling for Focus+ premium item
                        if (item.isPremium) {
                          return clsx(
                            'group relative flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden',
                            {
                              // Active premium state
                              'bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white shadow-2xl transform scale-105 animate-pulse': isActive,
                              // Non-active premium state - special highlighting
                              'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 text-amber-800 border-2 border-amber-200 shadow-lg hover:shadow-xl hover:scale-102 hover:border-amber-300': !isActive,
                            }
                          );
                        }

                        // Regular items styling
                        return clsx(
                          'group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden',
                          {
                            'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105': isActive,
                            'text-gray-700 hover:text-gray-900 hover:bg-gray-50': !isActive,
                          }
                        );
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          {/* ✅ Special Premium Background Animation */}
                          {item.isPremium && !isActive && (
                            <>
                              {/* Animated background sparkles */}
                              <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-2 right-2 animate-pulse">
                                  <Sparkles size={12} className="text-amber-400" />
                                </div>
                                <div className="absolute bottom-2 left-2 animate-pulse delay-500">
                                  <Star size={10} className="text-yellow-400" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping delay-1000">
                                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                                </div>
                              </div>

                              {/* Premium glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-yellow-200/30 to-orange-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            </>
                          )}

                          {/* Left side - Icon and Text */}
                          <div className="flex items-center gap-3 relative z-10">
                            <div
                              className={clsx(
                                'transition-all duration-200 p-2 rounded-lg flex items-center justify-center',
                                item.isPremium
                                  ? isActive
                                    ? 'text-zinc-600 bg-white bg-opacity-20'
                                    : 'text-amber-600 bg-gradient-to-r from-amber-100 to-yellow-100 group-hover:from-amber-200 group-hover:to-yellow-200 shadow-inner'
                                  : isActive
                                    ? 'text-zinc-600 bg-white bg-opacity-20'
                                    : 'text-gray-600 group-hover:text-blue-600 group-hover:bg-blue-50'
                              )}
                            >
                              {/* ✅ Premium crown icon with special effect */}
                              {item.isPremium ? (
                                <div className="relative">
                                  <Crown size={18} />
                                  {!isActive && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                                  )}
                                </div>
                              ) : (
                                item.icon
                              )}
                            </div>

                            <span
                              className={clsx(
                                'font-medium transition-colors duration-200',
                                item.isPremium
                                  ? isActive
                                    ? 'text-white font-bold'
                                    : 'text-amber-800 font-bold group-hover:text-amber-900'
                                  : isActive
                                    ? 'text-white'
                                    : 'text-gray-700 group-hover:text-gray-900'
                              )}
                            >
                              {item.name}
                            </span>
                          </div>

                          {/* Right side - Badge */}
                          {item.badge && (
                            <span
                              className={clsx(
                                'text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-200 relative z-10 flex items-center gap-1',
                                item.isPremium
                                  ? isActive
                                    ? 'bg-white bg-opacity-30 text-zinc-600'
                                    : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg animate-pulse'
                                  : isActive
                                    ? 'bg-white bg-opacity-20 text-zinc-600'
                                    : item.badge === 'FREE'
                                      ? 'bg-green-100 text-green-700 group-hover:bg-green-200'
                                      : item.badge === 'NEW'
                                        ? 'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
                                        : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
                              )}
                            >
                              {/* ✅ Premium badge with crown icon */}
                              {item.isPremium && (
                                <Crown size={10} />
                              )}
                              {item.badge}
                            </span>
                          )}

                          {/* Hover Effect Background for regular items */}
                          {!isActive && !item.isPremium && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                          )}

                          {/* Active Indicator */}
                          {isActive && (
                            <div className={clsx(
                              "absolute left-0 top-0 bottom-0 w-1 rounded-r-full",
                              item.isPremium ? "bg-white" : "bg-white"
                            )} />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer - Logout Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {/* <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className={clsx(
              'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform',
              logoutLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95'
            )}
          >
            {logoutLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={18} />
                <span>Logout</span>
              </>
            )}
          </button> */}

          {/* Status Bar */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Connected</span>
            <span className="mx-2">•</span>
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
