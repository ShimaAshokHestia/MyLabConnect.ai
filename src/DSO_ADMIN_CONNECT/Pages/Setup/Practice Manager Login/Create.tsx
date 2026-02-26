import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-theme.scss'; 
import { useTheme } from '../../../../ThemeProvider/ThemeProvider';

const DsoUserLoginCreate = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    mobile: '',
    role: 'MYD ADMIN',
    startDate: '25/02/2026',
    endDate: '',
    zone: '',
    country: '',
    county: '',
    city: '',
    practice: ''
  });

  const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
  
  const countriesByZone = {
    'North Zone': ['USA', 'Canada', 'Mexico'],
    'South Zone': ['Brazil', 'Argentina', 'Chile'],
    'East Zone': ['China', 'Japan', 'South Korea'],
    'West Zone': ['UK', 'France', 'Germany'],
    'Central Zone': ['Italy', 'Spain', 'Portugal']
  };

  const countiesByCountry = {
    'USA': ['Los Angeles County', 'Cook County', 'Harris County', 'Maricopa County'],
    'Canada': ['Toronto County', 'Vancouver County', 'Montreal County'],
    'Mexico': ['Mexico City County', 'Jalisco County', 'Nuevo León County'],
    'Brazil': ['São Paulo County', 'Rio de Janeiro County', 'Minas Gerais County'],
    'Argentina': ['Buenos Aires County', 'Córdoba County', 'Santa Fe County'],
    'Chile': ['Santiago County', 'Valparaíso County', 'Concepción County'],
    'China': ['Beijing County', 'Shanghai County', 'Guangdong County'],
    'Japan': ['Tokyo County', 'Osaka County', 'Kanagawa County'],
    'South Korea': ['Seoul County', 'Busan County', 'Incheon County'],
    'UK': ['Greater London', 'West Midlands', 'Greater Manchester'],
    'France': ['Paris County', 'Lyon County', 'Marseille County'],
    'Germany': ['Berlin County', 'Munich County', 'Hamburg County'],
    'Italy': ['Rome County', 'Milan County', 'Naples County'],
    'Spain': ['Madrid County', 'Barcelona County', 'Valencia County'],
    'Portugal': ['Lisbon County', 'Porto County', 'Braga County']
  };

  const citiesByCounty = {
    'Los Angeles County': ['Los Angeles', 'Long Beach', 'Glendale'],
    'Cook County': ['Chicago', 'Evanston', 'Oak Park'],
    'Harris County': ['Houston', 'Pasadena', 'Baytown'],
    'Maricopa County': ['Phoenix', 'Mesa', 'Scottsdale'],
    'Toronto County': ['Toronto', 'Mississauga', 'Brampton'],
    'Vancouver County': ['Vancouver', 'Surrey', 'Burnaby'],
    'Montreal County': ['Montreal', 'Laval', 'Longueuil'],
  };

  const practicesByCity = {
    'Los Angeles': ['Practice A', 'Practice B', 'Practice C'],
    'Chicago': ['Practice D', 'Practice E', 'Practice F'],
    'Houston': ['Practice G', 'Practice H', 'Practice I'],
    'Phoenix': ['Practice J', 'Practice K', 'Practice L'],
    'Toronto': ['Practice M', 'Practice N', 'Practice O'],
    'Vancouver': ['Practice P', 'Practice Q', 'Practice R'],
    'Montreal': ['Practice S', 'Practice T', 'Practice U'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'zone') {
        newData.country = '';
        newData.county = '';
        newData.city = '';
        newData.practice = '';
      } else if (name === 'country') {
        newData.county = '';
        newData.city = '';
        newData.practice = '';
      } else if (name === 'county') {
        newData.city = '';
        newData.practice = '';
      } else if (name === 'city') {
        newData.practice = '';
      }
      
      return newData;
    });
  };

  const getAvailableCountries = () => {
    return formData.zone ? countriesByZone[formData.zone] || [] : [];
  };

  const getAvailableCounties = () => {
    return formData.country ? countiesByCountry[formData.country] || [] : [];
  };

  const getAvailableCities = () => {
    return formData.county ? citiesByCounty[formData.county] || [] : [];
  };

  const getAvailablePractices = () => {
    return formData.city ? practicesByCity[formData.city] || [] : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      userId: '',
      userName: '',
      email: '',
      mobile: '',
      role: 'MYD ADMIN',
      startDate: '25/02/2026',
      endDate: '',
      zone: '',
      country: '',
      county: '',
      city: '',
      practice: ''
    });
  };

  return (
    <div className="container-fluid py-4 animate-fade-in" style={{ 
      backgroundColor: 'var(--theme-bg)',
      minHeight: '100vh'
    }}>
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-10 col-md-12">
          {/* Header Card */}
          <div className="card border-0 shadow-sm mb-4 animate-slide-in" style={{
            backgroundColor: 'var(--theme-bg-paper)',
            borderRadius: 'var(--bs-border-radius-lg)',
            border: '1px solid var(--theme-border)'
          }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1" style={{ color: 'var(--theme-text-primary)' }}>
                    Add DSO User Login
                  </h4>
                  <p style={{ color: 'var(--theme-text-secondary)', fontSize: '0.875rem' }}>
                    Create a new DSO user account
                  </p>
                </div>
                <span className="badge" style={{
                  backgroundColor: 'var(--theme-accent-light)',
                  color: 'var(--theme-text-primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem'
                }}>
                  New User
                </span>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="card border-0 shadow" style={{
            backgroundColor: 'var(--theme-bg-paper)',
            borderRadius: 'var(--bs-border-radius-lg)',
            border: '1px solid var(--theme-border)'
          }}>
            <form onSubmit={handleSubmit}>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* User ID */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      User ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="Enter User ID"
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                      required
                    />
                  </div>

                  {/* User Name */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      User Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter User Name"
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Mobile
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                    />
                  </div>

                  {/* Role */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Role <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)',
                        fontWeight: 500
                      }}
                      readOnly
                    />
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      End Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      placeholder="Pick a date"
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                    />
                  </div>

                  {/* Zone */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Zone <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)'
                      }}
                      required
                    >
                      <option value="">Select zone</option>
                      {zones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={!formData.zone}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)',
                        opacity: !formData.zone ? 0.6 : 1,
                        cursor: !formData.zone ? 'not-allowed' : 'pointer'
                      }}
                      required
                    >
                      <option value="">Select Country</option>
                      {getAvailableCountries().map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* County */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      County <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      disabled={!formData.country}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)',
                        opacity: !formData.country ? 0.6 : 1,
                        cursor: !formData.country ? 'not-allowed' : 'pointer'
                      }}
                      required
                    >
                      <option value="">Select County</option>
                      {getAvailableCounties().map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      City <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.county}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)',
                        opacity: !formData.county ? 0.6 : 1,
                        cursor: !formData.county ? 'not-allowed' : 'pointer'
                      }}
                      required
                    >
                      <option value="">Select City</option>
                      {getAvailableCities().map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Practice */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ color: 'var(--theme-text-primary)', fontWeight: 500 }}>
                      Practice <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="practice"
                      value={formData.practice}
                      onChange={handleChange}
                      disabled={!formData.city}
                      style={{
                        backgroundColor: 'var(--theme-bg)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-primary)',
                        borderRadius: 'var(--bs-border-radius)',
                        opacity: !formData.city ? 0.6 : 1,
                        cursor: !formData.city ? 'not-allowed' : 'pointer'
                      }}
                      required
                    >
                      <option value="">Select Practice</option>
                      {getAvailablePractices().map(practice => (
                        <option key={practice} value={practice}>{practice}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="card-footer border-0 p-4" style={{
                backgroundColor: 'var(--theme-bg-paper)',
                borderTop: '1px solid var(--theme-border)'
              }}>
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn px-4"
                    onClick={handleReset}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--theme-border)',
                      color: 'var(--theme-text-primary)',
                      borderRadius: 'var(--bs-border-radius)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--theme-bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn px-5"
                    style={{
                      backgroundColor: 'var(--theme-primary)',
                      borderColor: 'var(--theme-primary)',
                      color: '#ffffff',
                      borderRadius: 'var(--bs-border-radius)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--theme-primary-hover)';
                      e.target.style.borderColor = 'var(--theme-primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--theme-primary)';
                      e.target.style.borderColor = 'var(--theme-primary)';
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DsoUserLoginCreate;