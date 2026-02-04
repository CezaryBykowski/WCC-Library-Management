import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Reports({ events, libraries, categories }) {
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterLibraries, setFilterLibraries] = useState([]);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesCategory = filterCategories.length === 0 || filterCategories.includes(event.category);
    const matchesLibrary = filterLibraries.length === 0 || filterLibraries.includes(event.library);
    const matchesDateFrom = !filterDateFrom || new Date(event.date) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(event.date) <= new Date(filterDateTo);
    
    return matchesCategory && matchesLibrary && matchesDateFrom && matchesDateTo;
  });

  // Calculate statistics
  const totalEvents = filteredEvents.length;
  const totalAttendees = filteredEvents.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0);
  const totalAdults = filteredEvents.reduce((sum, e) => sum + e.attendees.adults, 0);
  const totalChildren = filteredEvents.reduce((sum, e) => sum + e.attendees.children, 0);
  const totalCost = filteredEvents.reduce((sum, e) => sum + e.cost, 0);
  const avgAttendees = totalEvents > 0 ? (totalAttendees / totalEvents).toFixed(1) : 0;
  const avgCost = totalEvents > 0 ? (totalCost / totalEvents).toFixed(2) : 0;

  // Events per library
  const eventsPerLibrary = libraries.map(lib => {
    const libEvents = filteredEvents.filter(e => e.library === lib.name);
    const libAttendees = libEvents.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0);
    const libCost = libEvents.reduce((sum, e) => sum + e.cost, 0);
    return {
      library: lib.name,
      events: libEvents.length,
      attendees: libAttendees,
      cost: libCost
    };
  }).filter(lib => lib.events > 0);

  // Category distribution
  const categoryData = categories.map(cat => {
    const catEvents = filteredEvents.filter(e => e.category === cat);
    return {
      category: cat,
      count: catEvents.length,
      attendees: catEvents.reduce((sum, e) => sum + e.attendees.adults + e.attendees.children, 0)
    };
  }).filter(cat => cat.count > 0);

  // Monthly trends
  const monthlyData = filteredEvents.reduce((acc, event) => {
    const month = new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, events: 0, attendees: 0, cost: 0 };
    }
    acc[month].events += 1;
    acc[month].attendees += event.attendees.adults + event.attendees.children;
    acc[month].cost += event.cost;
    return acc;
  }, {});

  const monthlyTrends = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month) - new Date(b.month)
  );

  // Funding source breakdown
  const fundingData = ['Library Budget', 'Donation', 'Other'].map(source => ({
    source,
    amount: filteredEvents.filter(e => e.fundingSource === source).reduce((sum, e) => sum + e.cost, 0),
    count: filteredEvents.filter(e => e.fundingSource === source).length
  })).filter(f => f.count > 0);

  const COLORS = ['#2C5F8D', '#E07A5F', '#81B29A', '#F4A896', '#4A7BA7', '#A5C9B8'];

  const handleCategoryChange = (category) => {
    setFilterCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLibraryChange = (library) => {
    setFilterLibraries(prev =>
      prev.includes(library)
        ? prev.filter(l => l !== library)
        : [...prev, library]
    );
  };

  const clearFilters = () => {
    setFilterCategories([]);
    setFilterLibraries([]);
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const attendeeBreakdown = [
    { name: 'Adults', value: totalAdults },
    { name: 'Children', value: totalChildren }
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p>Comprehensive event data analysis and insights</p>
      </div>

      {/* Filter Panel */}
      <div className="card mb-3">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
          Report Filters
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>
            Event Categories
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map(cat => (
              <label
                key={cat}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  background: filterCategories.includes(cat) ? 'var(--primary)' : 'var(--background)',
                  color: filterCategories.includes(cat) ? 'white' : 'var(--text-primary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: filterCategories.includes(cat) ? 'var(--primary)' : 'var(--border)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <input
                  type="checkbox"
                  checked={filterCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  style={{ marginRight: '0.5rem' }}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>
            Libraries
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {libraries.map(lib => (
              <label
                key={lib.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  background: filterLibraries.includes(lib.name) ? 'var(--accent)' : 'var(--background)',
                  color: filterLibraries.includes(lib.name) ? 'white' : 'var(--text-primary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: filterLibraries.includes(lib.name) ? 'var(--accent)' : 'var(--border)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <input
                  type="checkbox"
                  checked={filterLibraries.includes(lib.name)}
                  onChange={() => handleLibraryChange(lib.name)}
                  style={{ marginRight: '0.5rem' }}
                />
                {lib.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing {filteredEvents.length} of {events.length} events
          </div>
          {(filterCategories.length > 0 || filterLibraries.length > 0 || filterDateFrom || filterDateTo) && (
            <button onClick={clearFilters} className="btn btn-outline btn-sm">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="label">Total Events</div>
          <div className="value">{totalEvents}</div>
          <div className="subtext">In selected period</div>
        </div>

        <div className="stat-card">
          <div className="label">Total Attendees</div>
          <div className="value">{totalAttendees.toLocaleString()}</div>
          <div className="subtext">{totalAdults} adults, {totalChildren} children</div>
        </div>

        <div className="stat-card">
          <div className="label">Total Cost</div>
          <div className="value">${totalCost.toLocaleString()}</div>
          <div className="subtext">Combined expenses</div>
        </div>

        <div className="stat-card">
          <div className="label">Avg Attendees</div>
          <div className="value">{avgAttendees}</div>
          <div className="subtext">Per event</div>
        </div>

        <div className="stat-card">
          <div className="label">Avg Cost</div>
          <div className="value">${avgCost}</div>
          <div className="subtext">Per event</div>
        </div>

        <div className="stat-card">
          <div className="label">Attendance Rate</div>
          <div className="value">
            {totalEvents > 0 ? ((totalAttendees / totalEvents) * 100 / 50).toFixed(0) : 0}%
          </div>
          <div className="subtext">Based on avg capacity</div>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <>
          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Events by Library */}
            {eventsPerLibrary.length > 0 && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Events by Library</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsPerLibrary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="library" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="events" fill="#2C5F8D" name="Events" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Attendees by Library */}
            {eventsPerLibrary.length > 0 && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Attendees by Library</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsPerLibrary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="library" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="attendees" fill="#81B29A" name="Attendees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Cost by Library */}
            {eventsPerLibrary.length > 0 && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Cost by Library</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsPerLibrary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="library" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                      formatter={(value) => `$${value}`}
                    />
                    <Legend />
                    <Bar dataKey="cost" fill="#E07A5F" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Distribution */}
            {categoryData.length > 0 && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Event Category Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#718096', strokeWidth: 1 }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Adult vs Children Attendees */}
            <div className="chart-container">
              <div className="chart-header">
                <h3>Attendee Demographics</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendeeBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#2C5F8D" />
                    <Cell fill="#E07A5F" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Funding Sources */}
            {fundingData.length > 0 && (
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Funding Sources</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fundingData}
                      dataKey="amount"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {fundingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'white', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                      formatter={(value) => `$${value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Trends Over Time */}
          {monthlyTrends.length > 1 && (
            <div className="chart-container" style={{ marginBottom: '1.5rem' }}>
              <div className="chart-header">
                <h3>Trends Over Time</h3>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="events" stroke="#2C5F8D" strokeWidth={2} name="Events" />
                  <Line yAxisId="left" type="monotone" dataKey="attendees" stroke="#81B29A" strokeWidth={2} name="Attendees" />
                  <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#E07A5F" strokeWidth={2} name="Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Detailed Table */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
              Library Performance Summary
            </h3>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Library</th>
                    <th>Total Events</th>
                    <th>Total Attendees</th>
                    <th>Total Cost</th>
                    <th>Avg Attendees/Event</th>
                    <th>Avg Cost/Event</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsPerLibrary.map(lib => (
                    <tr key={lib.library}>
                      <td><strong>{lib.library}</strong></td>
                      <td>{lib.events}</td>
                      <td>{lib.attendees}</td>
                      <td>${lib.cost.toLocaleString()}</td>
                      <td>{(lib.attendees / lib.events).toFixed(1)}</td>
                      <td>${(lib.cost / lib.events).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No data to display</h3>
            <p>Adjust your filters or add more events to see reports</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;