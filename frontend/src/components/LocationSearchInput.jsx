import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { LocationInfo } from '../pages/Transportations';

const LocationSearchInput = ({ label, value, onSelect, placeholder, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/locations?page=0&size=30&locationName=${encodeURIComponent(searchTerm)}`, {
           credentials: 'include'
        });
        if (res.ok) {
          const json = await res.json();
          setResults(json.content || []);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>{label}</label>
      
      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: disabled ? '#f9fafb' : '#fef2f2', opacity: disabled ? 0.7 : 1 }}>
          <LocationInfo location={value} />
          {!disabled && (
            <button type="button" onClick={() => { onSelect(null); setSearchTerm(''); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-red)', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder={placeholder}
          disabled={disabled}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none', backgroundColor: disabled ? '#f9fafb' : 'white' }}
        />
      )}

      {isDropdownOpen && !value && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '4px', maxHeight: '200px', overflowY: 'auto' }}>
          {results.map(loc => (
            <div 
              key={loc.id} 
              onClick={() => { onSelect(loc); setIsDropdownOpen(false); setSearchTerm(''); }}
              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LocationInfo location={loc} />
            </div>
          ))}
        </div>
      )}
      
      {loading && !value && <div style={{ position: 'absolute', right: '12px', top: '38px', color: 'var(--text-muted)' }}><Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /></div>}
    </div>
  );
};

export default LocationSearchInput;
