import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Libraries from './components/Libraries';
import Reports from './components/Reports';
import EventForm from './components/EventForm';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [categories, setCategories] = useState([
    'Book Club',
    'Author Talk',
    'Children\'s Storytime',
    'Workshop',
    'Reading Group',
    'Computer Class',
    'Film Screening',
    'Art Exhibition',
    'Community Meeting',
    'Educational Program'
  ]);

  useEffect(() => {
    // Load data from localStorage on mount
    const savedEvents = localStorage.getItem('libraryEvents');
    const savedLibraries = localStorage.getItem('libraries');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Initialize with sample data
      const sampleEvents = [
        {
          id: 1,
          title: 'Children\'s Storytime: Winter Tales',
          library: 'Central Library',
          category: 'Children\'s Storytime',
          date: '2024-12-15',
          attendees: { adults: 8, children: 25 },
          cost: 150,
          fundingSource: 'Library Budget',
          description: 'Winter themed stories for children aged 3-7'
        },
        {
          id: 2,
          title: 'Author Talk: Local History',
          library: 'Westside Branch',
          category: 'Author Talk',
          date: '2024-12-20',
          attendees: { adults: 45, children: 0 },
          cost: 500,
          fundingSource: 'Donation',
          description: 'Meet local author discussing city heritage'
        },
        {
          id: 3,
          title: 'Digital Literacy Workshop',
          library: 'Central Library',
          category: 'Computer Class',
          date: '2025-01-10',
          attendees: { adults: 20, children: 0 },
          cost: 200,
          fundingSource: 'Library Budget',
          description: 'Basic computer skills for seniors'
        },
        {
          id: 4,
          title: 'Book Club: Modern Fiction',
          library: 'Eastside Branch',
          category: 'Book Club',
          date: '2025-01-15',
          attendees: { adults: 15, children: 0 },
          cost: 50,
          fundingSource: 'Other',
          description: 'Monthly book discussion group'
        },
        {
          id: 5,
          title: 'Children\'s Art Workshop',
          library: 'Westside Branch',
          category: 'Workshop',
          date: '2025-01-20',
          attendees: { adults: 5, children: 18 },
          cost: 300,
          fundingSource: 'Donation',
          description: 'Creative arts for ages 8-12'
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('libraryEvents', JSON.stringify(sampleEvents));
    }

    if (savedLibraries) {
      setLibraries(JSON.parse(savedLibraries));
    } else {
      const sampleLibraries = [
        { id: 1, name: 'Central Library', location: '123 Main Street', capacity: 200 },
        { id: 2, name: 'Westside Branch', location: '456 West Avenue', capacity: 100 },
        { id: 3, name: 'Eastside Branch', location: '789 East Boulevard', capacity: 80 }
      ];
      setLibraries(sampleLibraries);
      localStorage.setItem('libraries', JSON.stringify(sampleLibraries));
    }
  }, []);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('libraryEvents', JSON.stringify(updatedEvents));
  };

  const updateEvent = (id, updatedEvent) => {
    const updatedEvents = events.map(e => e.id === id ? { ...updatedEvent, id } : e);
    setEvents(updatedEvents);
    localStorage.setItem('libraryEvents', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (id) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('libraryEvents', JSON.stringify(updatedEvents));
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard events={events} libraries={libraries} />} />
            <Route path="/events" element={<Events events={events} deleteEvent={deleteEvent} categories={categories} libraries={libraries} />} />
            <Route path="/events/new" element={<EventForm addEvent={addEvent} libraries={libraries} categories={categories} />} />
            <Route path="/events/edit/:id" element={<EventForm events={events} updateEvent={updateEvent} libraries={libraries} categories={categories} />} />
            <Route path="/libraries" element={<Libraries libraries={libraries} events={events} />} />
            <Route path="/reports" element={<Reports events={events} libraries={libraries} categories={categories} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="sidebar">
      <div className="logo">
  <img 
    src="/westminster-logo.png" 
    alt="City of Westminster" 
    style={{ 
      width: '100%',
      maxWidth: '200px',
      marginBottom: '1rem'
    }} 
  />
  <h1>Library Events</h1>
</div>
      
      <ul className="nav-links">
        <li className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
          <Link to="/">
            <span className="icon"></span>
            Dashboard
          </Link>
        </li>
        <li className={isActive('/events') ? 'active' : ''}>
          <Link to="/events">
            <span className="icon"></span>
            Events
          </Link>
        </li>
        <li className={isActive('/libraries') ? 'active' : ''}>
          <Link to="/libraries">
            <span className="icon"></span>
            Libraries
          </Link>
        </li>
        <li className={isActive('/reports') ? 'active' : ''}>
          <Link to="/reports">
            <span className="icon"></span>
            Reports
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Library Management System</p>
        <p className="version">v1.0.0</p>
      </div>
    </nav>
  );
}

export default App;