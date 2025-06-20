import { useState, useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import AIChat from '@/components/organisms/AIChat';
import QuickAddTask from '@/components/molecules/QuickAddTask';
import { AuthContext } from './App';

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);
  
  return (
    <button 
      onClick={logout}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-50 transition-colors text-surface-600 hover:text-surface-900"
      title={`Logout ${user?.firstName || 'User'}`}
    >
      <ApperIcon name="LogOut" size={20} />
      <span className="hidden sm:inline text-sm font-medium">Logout</span>
    </button>
  );
}
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="Menu" size={20} className="text-surface-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={16} className="text-white" />
              </div>
              <h1 className="font-display font-bold text-xl text-surface-900 hidden sm:block">
                FlowTask AI
              </h1>
            </div>
          </div>

          {/* Center - Search and Quick Add */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <QuickAddTask />
          </div>

{/* Right side */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-surface-50 transition-colors">
              <ApperIcon name="Search" size={20} className="text-surface-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-50 transition-colors">
              <ApperIcon name="Bell" size={20} className="text-surface-600" />
            </button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : '-100%'
          }}
          className="lg:static lg:translate-x-0 fixed left-0 top-0 bottom-0 w-64 bg-surface-50 border-r border-surface-200 z-50 lg:z-40 overflow-y-auto"
        >
          <div className="p-4 pt-20 lg:pt-4">
            {/* Navigation */}
            <nav className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  {route.label}
                </NavLink>
              ))}
            </nav>

            {/* Quick stats */}
            <div className="mt-8 px-3">
              <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
                Today's Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Completed</span>
                  <span className="text-sm font-semibold text-success">8/12</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">Focus Time</span>
                  <span className="text-sm font-semibold text-primary">2h 45m</span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* AI Chat */}
      <AIChat isOpen={aiChatOpen} onToggle={() => setAiChatOpen(!aiChatOpen)} />
    </div>
  );
}