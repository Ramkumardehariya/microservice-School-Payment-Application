// src/components/Layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, School, Search, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'All Transactions', href: '/transactions', icon: BarChart3 },
    { name: 'School Transactions', href: '/school-transactions', icon: School },
    { name: 'Check Status', href: '/check-status', icon: Search },
  ];

  // Add Create Payment link only for trustees and admins
  console.log("user role: ", user);
  if (user && (user.role === 'trustee' || user.role === 'admin')) {
    navigation.push({ name: 'Create Payment', href: '/create-payment', icon: CreditCard });
  }

  return (
    <div className="w-64 bg-white shadow-sm dark:bg-gray-800 h-full">
      <nav className="mt-8 px-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;