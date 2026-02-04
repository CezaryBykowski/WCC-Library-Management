import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Events({ events, deleteEvent, categories, libraries }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLibrary, setFilterLibrary] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLibrary = !filterLibrary || event.library === filterLibrary;
    const matchesCategory = !filterCategory || event.category === filterCategory;
    const matchesDateFrom = !filterDateFrom || new Date(event.date) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(event.date) <= new Date(filterDateTo);
    
    return matchesSearch && matchesLibrary && matchesCategory && matchesDateFrom && matchesDateTo;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  return (
    <div className="events-page">
      <div className="page-header flex-between">
        <div>
          <h2>Events</h2>
          <p>Manage and view all library events</p>
        </div>
        <Link to="/events/new" className="btn btn-primary">
           Create New Event
        </Link>
      </div>

      <div className="card mb-3">
        <div className="search-filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select value={filterLibrary} onChange={(e) => setFilterLibrary(e.target.value)}>
              <option value="">All Libraries</option>
              {libraries.map(lib => (
                <option key={lib.id} value={lib.name}>{lib.name}</option>
              ))}
            </select>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              placeholder="From date"
              style={{ padding: '0.875rem 1rem', border: '2px solid var(--border)', borderRadius: '8px' }}
            />

            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              placeholder="To date"
              style={{ padding: '0.875rem 1rem', border: '2px solid var(--border)', borderRadius: '8px' }}
            />
          </div>
        </div>

        {(searchTerm || filterLibrary || filterCategory || filterDateFrom || filterDateTo) && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing {filteredEvents.length} of {events.length} events
            {(filterLibrary || filterCategory || filterDateFrom || filterDateTo) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterLibrary('');
                  setFilterCategory('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                style={{
                  marginLeft: '1rem',
                  color: 'var(--primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Library</th>
                <th>Category</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Cost</th>
                <th>Funding Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
                    {event.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                      </div>
                    )}
                  </td>
                  <td>{event.library}</td>
                  <td>
                    <span className={`badge badge-${event.category.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}`}>
                      {event.category}
                    </span>
                  </td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <div>{event.attendees.adults + event.attendees.children} total</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {event.attendees.adults} adults, {event.attendees.children} children
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${event.cost}</td>
                  <td>
                    <span className={`funding-badge funding-${event.fundingSource.toLowerCase().replace(/ /g, '-')}`}>
                      {event.fundingSource}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/events/edit/${event.id}`} className="btn btn-sm btn-outline">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No events found</h3>
            <p>
              {events.length === 0 
                ? "Get started by creating your first event" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {events.length === 0 && (
              <Link to="/events/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create First Event
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;