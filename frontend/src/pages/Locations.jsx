import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import { Search, Plus, X, Loader2 } from 'lucide-react';

const Locations = () => {
  const columns = [
    { header: 'Type', accessor: 'locationType' },
    { header: 'Name', accessor: 'locationName' },
    { header: 'Code', accessor: 'locationCode' },
    { header: 'Country', accessor: 'country' },
    { header: 'City', accessor: 'city' }
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 5
  });

  const [searchInput, setSearchInput] = useState({
    locationName: '',
    locationCode: '',
    country: '',
    city: '',
    locationType: ''
  });

  const [activeFilters, setActiveFilters] = useState({
    locationName: '',
    locationCode: '',
    country: '',
    city: '',
    locationType: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [newLocation, setNewLocation] = useState({
    locationName: '',
    locationCode: '',
    country: '',
    city: '',
    locationType: 'AIRPORT'
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) handleCloseModal();
        if (isDeleteModalOpen) handleCloseDeleteModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isDeleteModalOpen]);

  const handleOpenModal = () => {
    setEditingId(null);
    setNewLocation({
      locationName: '',
      locationCode: '',
      country: '',
      city: '',
      locationType: 'AIRPORT'
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (location) => {
    setEditingId(location.id);
    setNewLocation({
      locationName: location.locationName,
      locationCode: location.locationCode,
      country: location.country,
      city: location.city,
      locationType: location.locationType || 'AIRPORT'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitError('');
    setEditingId(null);
    setNewLocation({
      locationName: '',
      locationCode: '',
      country: '',
      city: '',
      locationType: 'AIRPORT'
    });
  };

  const handleNewLocationChange = (e) => {
    const { name, value } = e.target;
    if (name === 'locationCode') {
      setNewLocation(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setNewLocation(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateOrUpdateLocation = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validations
    const lettersSpacesRegex = /^[\p{L}\s]+$/u;

    if (newLocation.locationName.trim().length < 3 || newLocation.locationName.trim().length > 100) {
      setSubmitError('Location Name must be between 3 and 100 characters.');
      return;
    }
    if (!lettersSpacesRegex.test(newLocation.locationName)) {
      setSubmitError('Location Name must contain only letters.');
      return;
    }

    if (newLocation.country.trim().length < 3 || newLocation.country.trim().length > 60) {
      setSubmitError('Country must be between 3 and 60 characters.');
      return;
    }
    if (!lettersSpacesRegex.test(newLocation.country)) {
      setSubmitError('Country must contain only letters.');
      return;
    }

    if (newLocation.city.trim().length < 3 || newLocation.city.trim().length > 100) {
      setSubmitError('City must be between 3 and 100 characters.');
      return;
    }
    if (!lettersSpacesRegex.test(newLocation.city)) {
      setSubmitError('City must contain only letters.');
      return;
    }

    const codeRegex = /^[A-Z]+$/;
    if (newLocation.locationType === 'AIRPORT') {
      if (newLocation.locationCode.trim().length !== 3) {
        setSubmitError('Location Code must be exactly 3 characters for Airports.');
        return;
      }
    } else {
      if (newLocation.locationCode.trim().length < 3 || newLocation.locationCode.trim().length > 10) {
        setSubmitError('Location Code must be between 3 and 10 characters.');
        return;
      }
    }
    if (!codeRegex.test(newLocation.locationCode)) {
      setSubmitError('Location Code must contain only uppercase letters.');
      return;
    }

    setIsSubmitting(true);

    const url = editingId
      ? `http://localhost:8080/locations/${editingId}`
      : 'http://localhost:8080/locations';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 412) {
          throw new Error('412_CONFLICT');
        }
        throw new Error(editingId ? 'Failed to update location' : 'Failed to create location');
      }

      handleCloseModal();
      fetchLocations(pagination.currentPage, activeFilters);
    } catch (err) {
      console.error(err);
      if (err.message === '412_CONFLICT') {
        setSubmitError('A location already exists with the same location code');
      } else {
        setSubmitError(`Failed to ${editingId ? 'update' : 'create'} location. Please check your inputs and try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
    setDeleteError('');
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setLocationToDelete(null);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`http://localhost:8080/locations/${locationToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to delete location');
      }

      handleCloseDeleteModal();
      fetchLocations(pagination.currentPage, activeFilters);
    } catch (err) {
      console.error(err);
      setDeleteError('Failed to delete location. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchLocations = async (page, filtersToApply) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        size: pagination.pageSize.toString(),
      });
      if (filtersToApply.locationName) query.append('locationName', filtersToApply.locationName);
      if (filtersToApply.locationCode) query.append('locationCode', filtersToApply.locationCode);
      if (filtersToApply.country) query.append('country', filtersToApply.country);
      if (filtersToApply.city) query.append('city', filtersToApply.city);
      if (filtersToApply.locationType) query.append('locationType', filtersToApply.locationType);

      const res = await fetch(`http://localhost:8080/locations?${query.toString()}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();

      setData(json.content || []);
      setPagination(prev => ({
        ...prev,
        currentPage: json.number || 0,
        totalPages: json.totalPages || 0,
        totalElements: json.totalElements || 0
      }));
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations(0, activeFilters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilters(searchInput);
    fetchLocations(0, searchInput);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchLocations(newPage, activeFilters);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInput(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Locations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and view all operational locations</p>
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
            boxShadow: '0 2px 4px rgba(232, 25, 50, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          <Plus size={18} />
          Add Location
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-color-white)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Name</label>
            <input
              type="text"
              name="locationName"
              value={searchInput.locationName}
              onChange={handleInputChange}
              placeholder="Search by name..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Code</label>
            <input
              type="text"
              name="locationCode"
              value={searchInput.locationCode}
              onChange={handleInputChange}
              placeholder="Code (e.g. IST)"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Country</label>
            <input
              type="text"
              name="country"
              value={searchInput.country}
              onChange={handleInputChange}
              placeholder="Country"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>City</label>
            <input
              type="text"
              name="city"
              value={searchInput.city}
              onChange={handleInputChange}
              placeholder="City"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Type</label>
            <select
              name="locationType"
              value={searchInput.locationType}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
            >
              <option value="">All Types</option>
              <option value="AIRPORT">Airport</option>
              <option value="VENUE">Venue</option>
            </select>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button type="submit" style={{
              backgroundColor: 'var(--text-main)',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
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
              <Search size={18} />
              Search
            </button>
          </div>
        </form>
      </div>

      <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s', marginTop: '24px' }}>
        <DataTable
          columns={columns}
          data={data}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages: pagination.totalPages,
            totalElements: pagination.totalElements,
            onPageChange: handlePageChange,
            onEdit: handleEditClick,
            onDelete: handleDeleteClick
          }}
        />
      </div>
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
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
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
                {editingId ? 'Edit Location' : 'Add New Location'}
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

            <form onSubmit={handleCreateOrUpdateLocation} style={{ padding: '24px' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Name</label>
                  <input type="text" name="locationName" value={newLocation.locationName} onChange={handleNewLocationChange} placeholder="e.g. Istanbul Airport" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Code</label>
                  <input type="text" name="locationCode" value={newLocation.locationCode} onChange={handleNewLocationChange} placeholder="e.g. IST" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Country</label>
                    <input type="text" name="country" value={newLocation.country} onChange={handleNewLocationChange} placeholder="e.g. Turkey" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>City</label>
                    <input type="text" name="city" value={newLocation.city} onChange={handleNewLocationChange} placeholder="e.g. Istanbul" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Location Type</label>
                  <select name="locationType" value={newLocation.locationType} onChange={handleNewLocationChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none', backgroundColor: 'white' }}>
                    <option value="AIRPORT">Airport</option>
                    <option value="VENUE">Venue</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-red)', color: 'white', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (editingId ? 'Update Location' : 'Create Location')}
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
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 16px 0' }}>Delete Location</h2>

            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong>{locationToDelete?.locationName}</strong>? This action cannot be undone.
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
                onClick={handleCloseDeleteModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary-red)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : 'Delete Location'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
