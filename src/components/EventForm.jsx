import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EventForm({ addEvent, updateEvent, events, libraries, categories }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    title: '',
    library: '',
    category: '',
    date: '',
    attendees: {
      adults: 0,
      children: 0
    },
    cost: 0,
    fundingSource: 'Library Budget',
    description: ''
  });

  useEffect(() => {
    if (isEditing && events) {
      const event = events.find(e => e.id === parseInt(id));
      if (event) {
        setFormData(event);
      }
    }
  }, [id, isEditing, events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('attendees.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        attendees: {
          ...prev.attendees,
          [field]: parseInt(value) || 0
        }
      }));
    } else if (name === 'cost') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEvent(parseInt(id), formData);
    } else {
      addEvent(formData);
    }
    navigate('/events');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = formData.title && formData.library && formData.category && formData.date;
  const canProceedStep2 = formData.attendees.adults >= 0 && formData.attendees.children >= 0;

  return (
    <div className="event-form-page">
      <div className="page-header">
        <h2>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
        <p>{isEditing ? 'Update event details' : 'Add a new event to the system'}</p>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            {[1, 2, 3].map(step => (
              <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step <= currentStep ? 'var(--primary)' : 'var(--border)',
                  color: step <= currentStep ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}>
                  {step}
                </div>
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: step <= currentStep ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: step === currentStep ? 600 : 400
                }}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Attendance' : 'Cost & Details'}
                </div>
              </div>
            ))}
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Basic Information</h3>
              
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Children's Storytime: Winter Tales"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Library *</label>
                  <select
                    name="library"
                    value={formData.library}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a library</option>
                    {libraries.map(lib => (
                      <option key={lib.id} value={lib.name}>{lib.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the event"
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Step 2: Attendance */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Attendance Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Adult Attendees *</label>
                  <input
                    type="number"
                    name="attendees.adults"
                    value={formData.attendees.adults}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Child Attendees *</label>
                  <input
                    type="number"
                    name="attendees.children"
                    value={formData.attendees.children}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'var(--background)',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Total Attendees
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {formData.attendees.adults + formData.attendees.children}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {formData.attendees.adults} adults + {formData.attendees.children} children
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Cost & Funding */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Cost & Funding Details</h3>
              
              <div className="form-group">
                <label>Event Cost ($) *</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Funding Source *</label>
                <select
                  name="fundingSource"
                  value={formData.fundingSource}
                  onChange={handleChange}
                  required
                >
                  <option value="Library Budget">Library Budget</option>
                  <option value="Donation">Donation</option>
                  <option value="Other">Other</option>
                </select>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Indicates where the funding for this event comes from
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                background: 'var(--background)',
                borderRadius: '8px',
                marginTop: '1.5rem'
              }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Event Summary</h4>
                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Title:</span>
                    <strong>{formData.title || 'Not set'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Library:</span>
                    <strong>{formData.library || 'Not set'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Category:</span>
                    <strong>{formData.category || 'Not set'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                    <strong>{formData.date ? new Date(formData.date).toLocaleDateString() : 'Not set'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Attendees:</span>
                    <strong>{formData.attendees.adults + formData.attendees.children}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Cost:</span>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>${formData.cost}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn btn-outline">
                  ← Previous
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => navigate('/events')} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              
              {currentStep < totalSteps ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="btn btn-primary"
                  disabled={currentStep === 1 && !canProceedStep1}
                >
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {isEditing ? '✓ Update Event' : '✓ Create Event'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;