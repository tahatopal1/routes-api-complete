import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { Loader2, Plane, Bus, Car, TrainFront, X } from 'lucide-react';
import LocationSearchInput from '../components/LocationSearchInput';

export const OpDaysDisplay = ({ days }) => {
  const allDays = [
    { num: 1, label: 'M' },
    { num: 2, label: 'T' },
    { num: 3, label: 'W' },
    { num: 4, label: 'T' },
    { num: 5, label: 'F' },
    { num: 6, label: 'S' },
    { num: 7, label: 'S' }
  ];

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '8px', fontWeight: '600', color: 'var(--text-muted)', fontSize: '12px' }}>
        {allDays.map(d => <span key={d.num} style={{ width: '14px', textAlign: 'center' }}>{d.label}</span>)}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '13px' }}>
        {allDays.map(d => {
          const isActive = days?.includes(d.num);
          return (
            <span key={d.num} style={{
              width: '14px',
              textAlign: 'center',
              color: isActive ? '#10b981' : '#ef4444',
              fontWeight: 'bold'
            }}>
              {isActive ? '✓' : 'X'}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const LocationInfo = ({ location }) => {
  if (!location) return null;
  return (
    <div>
      <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>
        {location.locationName} <span style={{ color: 'var(--primary-red)', padding: '2px 6px', backgroundColor: '#fef2f2', borderRadius: '4px', fontSize: '12px', marginLeft: '4px' }}>{location.locationCode}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {location.city}, {location.country}
      </div>
    </div>
  );
};

const TypeIcon = ({ type }) => {
  if (type === 'FLIGHT') return <Plane size={18} />;
  if (type === 'BUS') return <Bus size={18} />;
  if (type === 'UBER') return <Car size={18} />;
  if (type === 'SUBWAY') return <TrainFront size={18} />;
  return <Car size={18} />; // fallback
};



const Transportations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [newTransportation, setNewTransportation] = useState({
    origin: null,
    destination: null,
    transportationType: 'FLIGHT',
    opDays: []
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [searchInput, setSearchInput] = useState({
    origin: '',
    destination: '',
    transportationType: '',
    day: ''
  });

  const [activeFilters, setActiveFilters] = useState({
    origin: '',
    destination: '',
    transportationType: '',
    day: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    pageSize: 5,
    totalElements: 0
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) handleCloseModal();
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
          setDeleteError('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isDeleteModalOpen]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSubmitError('');
    setNewTransportation({
      origin: null,
      destination: null,
      transportationType: 'FLIGHT',
      opDays: []
    });
  };

  const handleOpDayToggle = (day) => {
    setNewTransportation(prev => {
      const isSelected = prev.opDays.includes(day);
      if (isSelected) {
        return { ...prev, opDays: prev.opDays.filter(d => d !== day) };
      } else {
        return { ...prev, opDays: [...prev.opDays, day].sort((a, b) => a - b) };
      }
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewTransportation({
      origin: item.originalData.origin,
      destination: item.originalData.destination,
      transportationType: item.originalData.transportationType,
      opDays: item.originalData.opDays || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeletingId(item.id);
    setIsDeleteModalOpen(true);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`http://localhost:8080/transportations/${deletingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete transportation');
      setIsDeleteModalOpen(false);
      setDeletingId(null);

      const isLastItemOnPage = data.length === 1;
      const newPage = isLastItemOnPage && pagination.currentPage > 0 ? pagination.currentPage - 1 : pagination.currentPage;
      fetchTransportations(newPage, activeFilters);
    } catch (err) {
      setDeleteError('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateTransportation = async (e) => {
    e.preventDefault();
    if (!newTransportation.origin || !newTransportation.destination) {
      setSubmitError('Both Origin and Destination must be selected.');
      return;
    }

    if (newTransportation.origin.id === newTransportation.destination.id) {
      setSubmitError('Origin and destination cannot be the same');
      return;
    }

    if (newTransportation.transportationType === 'FLIGHT') {
      if (newTransportation.origin.locationType !== 'AIRPORT' || newTransportation.destination.locationType !== 'AIRPORT') {
        setSubmitError('Flights can only operate between airports');
        return;
      }
    }

    if (newTransportation.origin.locationType === 'AIRPORT' && newTransportation.destination.locationType === 'AIRPORT') {
      if (newTransportation.transportationType !== 'FLIGHT') {
        setSubmitError('Transportation between two Airports must be a FLIGHT.');
        return;
      }
    }

    if (newTransportation.origin.locationType === 'VENUE' && newTransportation.destination.locationType === 'VENUE') {
      setSubmitError('Transportation between two Venues is not allowed.');
      return;
    }

    setIsSubmittingModal(true);
    setSubmitError('');

    try {
      const payload = {
        origin: { id: newTransportation.origin.id, locationType: newTransportation.origin.locationType },
        destination: { id: newTransportation.destination.id, locationType: newTransportation.destination.locationType },
        transportationType: newTransportation.transportationType,
        opDays: newTransportation.opDays
      };

      const url = editingId ? `http://localhost:8080/transportations/${editingId}` : 'http://localhost:8080/transportations';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 412) {
          throw new Error('412_CONFLICT');
        }
        throw new Error('Failed to create transportation');
      }

      handleCloseModal();
      fetchTransportations(0, activeFilters);
    } catch (err) {
      console.error(err);
      if (err.message === '412_CONFLICT') {
        setSubmitError('Transportation already exists');
      } else {
        setSubmitError('Failed to create transportation. Please try again.');
      }
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const columns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Origin', accessor: 'origin' },
    { header: 'Destination', accessor: 'destination' },
    { header: 'Operational Days', accessor: 'opDays' }
  ];

  const fetchTransportations = async (page, filtersToApply = activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        size: pagination.pageSize
      });

      if (filtersToApply.origin) queryParams.append('origin', filtersToApply.origin);
      if (filtersToApply.destination) queryParams.append('destination', filtersToApply.destination);
      if (filtersToApply.transportationType) queryParams.append('transportationType', filtersToApply.transportationType);
      if (filtersToApply.day) queryParams.append('day', filtersToApply.day);

      const res = await fetch(`http://localhost:8080/transportations?${queryParams.toString()}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();

      const formattedData = (json.content || []).map(item => ({
        id: item.id,
        originalData: item,
        type: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: 'var(--text-main)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              color: 'var(--text-main)'
            }}>
              <TypeIcon type={item.transportationType} />
            </div>
            {item.transportationType}
          </div>
        ),
        origin: <LocationInfo location={item.origin} />,
        destination: <LocationInfo location={item.destination} />,
        opDays: <OpDaysDisplay days={item.opDays} />
      }));

      setData(formattedData);
      setPagination(prev => ({
        ...prev,
        currentPage: json.pageable.pageNumber,
        totalPages: json.totalPages,
        totalElements: json.totalElements
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to load transportations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportations(0, activeFilters);
  }, []);

  const handlePageChange = (newPage) => {
    fetchTransportations(newPage, activeFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilters(searchInput);
    fetchTransportations(0, searchInput);
  };

  const handleReset = () => {
    const emptyFilters = {
      origin: '',
      destination: '',
      transportationType: '',
      day: ''
    };
    setSearchInput(emptyFilters);
    setActiveFilters(emptyFilters);
    fetchTransportations(0, emptyFilters);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Transportations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your itineraries and operational days</p>
        </div>
        <button
          onClick={handleOpenModal}
          style={{
            backgroundColor: 'var(--primary-red)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(232, 25, 50, 0.3)'
          }}
        >
          Add Transportation
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-color-white)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '24px', border: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Origin</label>
            <input
              type="text"
              name="origin"
              value={searchInput.origin}
              onChange={handleInputChange}
              placeholder="e.g. Istanbul Airport"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Destination</label>
            <input
              type="text"
              name="destination"
              value={searchInput.destination}
              onChange={handleInputChange}
              placeholder="e.g. Heathrow Airport"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Trans. Type</label>
            <select
              name="transportationType"
              value={searchInput.transportationType}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
            >
              <option value="">All Types</option>
              <option value="FLIGHT">Flight</option>
              <option value="BUS">Bus</option>
              <option value="UBER">Uber</option>
              <option value="SUBWAY">Subway</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '120px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Op. Day</label>
            <select
              name="day"
              value={searchInput.day}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
            >
              <option value="">Any Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="7">Sunday</option>
            </select>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button type="submit" style={{
              backgroundColor: 'var(--text-main)',
              color: 'white',
              border: 'none',
              padding: '0 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '42px',
              transition: 'background-color 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--text-main)'}
            >
              Search
            </button>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button type="button" onClick={handleReset} style={{
              backgroundColor: 'white',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '0 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '42px',
              transition: 'all 0.2s'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {error ? (
        <div style={{ marginTop: '24px', color: 'var(--primary-red)', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      ) : (
        <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s', marginTop: '24px' }}>
          <DataTable
            columns={columns}
            data={data}
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              totalElements: pagination.totalElements,
              onPageChange: handlePageChange,
              onEdit: handleEdit,
              onDelete: handleDeleteClick
            }}
          />
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '24px'
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: 'var(--bg-color-white)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                {editingId ? 'Edit Transportation' : 'Add New Transportation'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransportation} style={{ padding: '24px' }}>
              {submitError && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  color: 'var(--primary-red)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #fecaca'
                }}>
                  {submitError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <LocationSearchInput
                    label="Origin Location"
                    placeholder="Search origin..."
                    value={newTransportation.origin}
                    onSelect={(loc) => setNewTransportation(prev => ({ ...prev, origin: loc }))}
                    disabled={!!editingId}
                  />
                  <LocationSearchInput
                    label="Destination Location"
                    placeholder="Search destination..."
                    value={newTransportation.destination}
                    onSelect={(loc) => setNewTransportation(prev => ({ ...prev, destination: loc }))}
                    disabled={!!editingId}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Transportation Type</label>
                  <select
                    value={newTransportation.transportationType}
                    onChange={(e) => setNewTransportation(prev => ({ ...prev, transportationType: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none', backgroundColor: 'white' }}
                  >
                    <option value="FLIGHT">Flight</option>
                    <option value="BUS">Bus</option>
                    <option value="UBER">Uber</option>
                    <option value="SUBWAY">Subway</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '12px' }}>Operational Days</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { num: 1, label: 'Mon' }, { num: 2, label: 'Tue' }, { num: 3, label: 'Wed' },
                      { num: 4, label: 'Thu' }, { num: 5, label: 'Fri' }, { num: 6, label: 'Sat' }, { num: 7, label: 'Sun' }
                    ].map(day => (
                      <label key={day.num} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-main)' }}>
                        <input
                          type="checkbox"
                          checked={newTransportation.opDays.includes(day.num)}
                          onChange={() => handleOpDayToggle(day.num)}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingModal} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-red)', color: 'white', fontWeight: '600', cursor: isSubmittingModal ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isSubmittingModal ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (editingId ? 'Update Transportation' : 'Create Transportation')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '24px'
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: 'var(--bg-color-white)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 16px 0' }}>Confirm Deletion</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                Are you sure you want to delete this transportation? This action cannot be undone.
              </p>

              {deleteError && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  color: 'var(--primary-red)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #fecaca'
                }}>
                  {deleteError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-red)', color: 'white', fontWeight: '600', cursor: isDeleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transportations;
