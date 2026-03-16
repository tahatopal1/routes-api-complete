import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Truck, Map, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Locations', path: '/locations', icon: <MapPin size={20} /> },
    { name: 'Transportations', path: '/transportations', icon: <Truck size={20} /> },
    { name: 'Routes', path: '/routes', icon: <Map size={20} /> }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-color-white)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      boxShadow: '2px 0 8px rgba(0,0,0,0.02)',
      zIndex: 10
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'var(--sidebar-active-text)' : 'var(--text-muted)',
              backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s ease'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '0 16px', marginTop: 'auto' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: '500',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '16px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.color = 'var(--primary-red)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
