import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  BookOpen,
  BookCheck,
  History as HistoryIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { icon: Users, label: 'Users', path: '/dashboard/users' },
  { icon: BookOpen, label: 'Borrowing', path: '/dashboard/borrowing' },
  { icon: BookCheck, label: 'Returns', path: '/dashboard/returns' },
  { icon: HistoryIcon, label: 'History', path: '/dashboard/history' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">SDN 01 Semper Timur</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t border-gray-200 pt-4">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="h-full px-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Page content */}
        <main 
          className="p-6 min-h-[calc(100vh-4rem)] bg-cover bg-center bg-fixed bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
          }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}