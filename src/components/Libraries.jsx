import React from 'react';

function Libraries({ libraries, events }) {
  return (
    <div className="libraries-page">
      <div className="page-header">
        <h2>Libraries</h2>
        <p>Overview of all library locations and their event statistics</p>
      </div>

      {libraries.length > 0 ? (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {libraries.map(library => {
            const libraryEvents = events.filter(e => e.library === library.name);
            const totalAttendees = libraryEvents.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0);
            const totalCost = libraryEvents.reduce((sum, e) => sum + e.cost, 0);
            const avgAttendees = libraryEvents.length > 0 ? Math.round(totalAttendees / libraryEvents.length) : 0;
            const avgCost = libraryEvents.length > 0 ? Math.round(totalCost / libraryEvents.length) : 0;

            const categoryBreakdown = libraryEvents.reduce((acc, event) => {
              acc[event.category] = (acc[event.category] || 0) + 1;
              return acc;
            }, {});

            const upcomingEvents = libraryEvents.filter(e => new Date(e.date) >= new Date());

            return (
              <div key={library.id} className="card" style={{ animation: 'fadeInUp 0.6s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {library.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                      📍 {library.location}
                    </p>

                    <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Total Events
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {libraryEvents.length}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Upcoming
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                          {upcomingEvents.length}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Total Attendees
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {totalAttendees.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Total Cost
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                          ${totalCost.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Avg Attendees/Event
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
                          {avgAttendees}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Avg Cost/Event
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--secondary)' }}>
                          ${avgCost}
                        </div>
                      </div>
                    </div>

                    {Object.keys(categoryBreakdown).length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>
                          Event Categories
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {Object.entries(categoryBreakdown).map(([category, count]) => (
                            <span 
                              key={category} 
                              className={`badge badge-${category.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}`}
                              style={{ fontSize: '0.875rem' }}
                            >
                              {category} ({count})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                        Capacity
                      </div>
                      <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>
                        {library.capacity}
                      </div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                        people
                      </div>
                    </div>

                    {libraryEvents.length > 0 && (
                      <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--background)', borderRadius: '8px' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Recent Events
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {libraryEvents
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 3)
                            .map(event => (
                              <div key={event.id} style={{ fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{event.title}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🏛️</div>
            <h3>No libraries yet</h3>
            <p>Library locations will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Libraries;