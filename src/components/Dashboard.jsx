import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ events, libraries }) {
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
  const totalAttendees = events.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0);
  const totalCost = events.reduce((sum, e) => sum + e.cost, 0);

  const recentEvents = events
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of library events and statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Events</div>
          <div className="value">{totalEvents}</div>
          <div className="subtext">All time events recorded</div>
        </div>

        <div className="stat-card">
          <div className="label">Upcoming Events</div>
          <div className="value">{upcomingEvents}</div>
          <div className="subtext">Scheduled for the future</div>
        </div>

        <div className="stat-card">
          <div className="label">Total Attendees</div>
          <div className="value">{totalAttendees.toLocaleString()}</div>
          <div className="subtext">Across all events</div>
        </div>

        <div className="stat-card">
          <div className="label">Total Cost</div>
          <div className="value">${totalCost.toLocaleString()}</div>
          <div className="subtext">Combined event costs</div>
        </div>

        <div className="stat-card">
          <div className="label">Active Libraries</div>
          <div className="value">{libraries.length}</div>
          <div className="subtext">Library locations</div>
        </div>

        <div className="stat-card">
          <div className="label">Avg Cost/Event</div>
          <div className="value">${totalEvents > 0 ? Math.round(totalCost / totalEvents) : 0}</div>
          <div className="subtext">Average event expense</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Recent Events</h3>
          {recentEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentEvents.map(event => (
                <div key={event.id} style={{ 
                  padding: '1rem', 
                  background: 'var(--background)', 
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{event.title}</strong>
                    <span className={`badge badge-${event.category.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}`}>
                      {event.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div>{event.library} • {new Date(event.date).toLocaleDateString()}</div>
                    <div style={{ marginTop: '0.25rem' }}>
                      {event.attendees.adults + event.attendees.children} attendees • ${event.cost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📅</div>
              <p>No events yet</p>
            </div>
          )}
          <Link to="/events" style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            color: 'var(--primary)', 
            textDecoration: 'none',
            fontWeight: 500 
          }}>
            View all events →
          </Link>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Top Event Categories</h3>
          {topCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topCategories.map(([category, count]) => (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{category}</span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{count} events</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(count / totalEvents) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📊</div>
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Library Locations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {libraries.map(library => {
              const libraryEvents = events.filter(e => e.library === library.name);
              const libraryAttendees = libraryEvents.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0);
              const libraryCost = libraryEvents.reduce((sum, e) => sum + e.cost, 0);
              
              return (
                <div key={library.id} style={{ 
                  padding: '1.5rem', 
                  background: 'var(--background)', 
                  borderRadius: '8px',
                  borderTop: '3px solid var(--accent)'
                }}>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
                    {library.name}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {library.location}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Events</div>
                      <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {libraryEvents.length}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Attendees</div>
                      <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {libraryAttendees}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Total Cost</div>
                      <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        ${libraryCost}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-secondary)' }}>Capacity</div>
                      <div style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--primary)' }}>
                        {library.capacity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;