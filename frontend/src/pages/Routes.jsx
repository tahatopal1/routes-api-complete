import React, { useState } from 'react';
import { Loader2, Calendar, MapPin, Plane, Bus, Car, TrainFront, Navigation, ArrowRight } from 'lucide-react';
import LocationSearchInput from '../components/LocationSearchInput';

const TypeIcon = ({ type }) => {
  if (type === 'FLIGHT') return <Plane size={18} />;
  if (type === 'BUS') return <Bus size={18} />;
  if (type === 'UBER') return <Car size={18} />;
  if (type === 'SUBWAY') return <TrainFront size={18} />;
  return <Car size={18} />; // fallback
};

const Routes = () => {
  const [searchParams, setSearchParams] = useState({
    origin: null,
    destination: null,
    searchDate: ''
  });

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.origin || !searchParams.destination || !searchParams.searchDate) {
      setError('Please select an origin, destination, and date.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const payload = {
        origin: { id: searchParams.origin.id, locationType: searchParams.origin.locationType },
        destination: { id: searchParams.destination.id, locationType: searchParams.destination.locationType },
        searchDate: searchParams.searchDate
      };

      const res = await fetch('http://localhost:8080/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to fetch routes');
      const json = await res.json();
      setRoutes(json);
    } catch (err) {
      console.error(err);
      setError('Failed to find routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateViaLocation = (itinerary) => {
    const flightLeg = itinerary.find(leg => leg.transportationType === 'FLIGHT');
    if (flightLeg) {
      // Return the origin of the flight leg since it's the "via" point usually
      // However sometimes the connecting point is explicitly the destination of the first flight, or origin of second.
      // Based on the example payload, the flight origin is the first airport.
      return {
        locationName: flightLeg.origin.locationName,
        locationCode: flightLeg.origin.locationCode,
      };
    }

    // Fallback to first leg's destination if no flight found
    if (itinerary.length > 0) {
      return {
        locationName: itinerary[0].destination.locationName,
        locationCode: itinerary[0].destination.locationCode
      };
    }

    return null;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Routes Search</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find available itineraries between origin and destination venues.</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-color-white)', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <LocationSearchInput
              label="Origin"
              placeholder="Search origin venue..."
              value={searchParams.origin}
              onSelect={(loc) => setSearchParams(prev => ({ ...prev, origin: loc }))}
            />
          </div>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <LocationSearchInput
              label="Destination"
              placeholder="Search destination venue..."
              value={searchParams.destination}
              onSelect={(loc) => setSearchParams(prev => ({ ...prev, destination: loc }))}
            />
          </div>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '8px' }}>Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={searchParams.searchDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, searchDate: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '15px', outline: 'none', color: 'var(--text-main)' }}
              />
            </div>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <button type="submit" disabled={loading} style={{
              backgroundColor: 'var(--primary-red)',
              color: 'white',
              border: 'none',
              padding: '0 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '42px',
              boxShadow: '0 2px 4px rgba(232, 25, 50, 0.3)',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
              Search Routes
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div style={{ color: 'var(--primary-red)', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {hasSearched && !loading && !error && (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-main)' }}>
            Available Itineraries ({routes.length})
          </h2>

          {routes.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-color-white)', padding: '48px 24px', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Navigation size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '500' }}>No routes found for this criteria.</p>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>Try adjusting your dates or locations.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {routes.map((routeObj, index) => {
                const itinerary = routeObj.itinerary || [];
                if (itinerary.length === 0) return null;

                const finalDest = itinerary[itinerary.length - 1].destination;
                const initialOrigin = itinerary[0].origin;

                const viaData = calculateViaLocation(itinerary);

                return (
                  <div key={index} style={{
                    backgroundColor: 'var(--bg-color-white)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header Summary */}
                    <div style={{
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: '#fafafa'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontWeight: '600', fontSize: '18px', color: 'var(--text-main)' }}>
                            {initialOrigin.locationName} <span style={{ color: 'var(--primary-red)', fontSize: '13px', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>{initialOrigin.locationCode}</span>
                          </div>
                          <ArrowRight size={20} color="var(--text-muted)" />
                          <div style={{ fontWeight: '600', fontSize: '18px', color: 'var(--text-main)' }}>
                            {finalDest.locationName} <span style={{ color: 'var(--primary-red)', fontSize: '13px', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>{finalDest.locationCode}</span>
                          </div>
                        </div>

                        {viaData && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', backgroundColor: 'white', padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                            <span>Via:</span>
                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{viaData.locationName}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{itinerary.length} Leg{itinerary.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    {/* Legs Details */}
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap', overflowX: 'auto' }}>
                      {itinerary.map((leg, legIndex) => (
                        <React.Fragment key={leg.id || legIndex}>
                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '180px', flex: '1' }}>
                            {/* Transport Mode Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-red)', fontWeight: '600', fontSize: '13px' }}>
                              <div style={{ backgroundColor: '#fef2f2', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                                <TypeIcon type={leg.transportationType} />
                              </div>
                              {leg.transportationType}
                            </div>

                            {/* Leg Path */}
                            <div style={{ position: 'relative', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {/* Timeline Line */}
                              <div style={{ position: 'absolute', left: '5px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#e5e7eb' }}></div>

                              {/* Origin */}
                              <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-red)', border: '2px solid white', boxShadow: '0 0 0 1px #e5e7eb' }}></div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', lineHeight: '1.2' }}>{leg.origin.locationName}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{leg.origin.locationCode}</div>
                              </div>

                              {/* Destination */}
                              <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid var(--primary-red)', boxShadow: '0 0 0 1px #e5e7eb' }}></div>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)', lineHeight: '1.2' }}>{leg.destination.locationName}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{leg.destination.locationCode}</div>
                              </div>
                            </div>
                          </div>

                          {legIndex < itinerary.length - 1 && (
                            <div style={{ flex: '0 0 auto', color: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ArrowRight size={24} />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Routes;
