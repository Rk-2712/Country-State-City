import { useState, useEffect } from 'react';

export default function State() {
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Data states
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [sname, setSname] = useState("");
  const [countryId, setCountryId] = useState("");
  const [scapital, setScapital] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingStateId, setEditingStateId] = useState(null);

  // Filter & Pagination states
  const [selectedCountryFilter, setSelectedCountryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(14);

  // Fetch all countries and states
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch states
      const statesRes = await fetch(`${base_url}/api/states`);
      if (!statesRes.ok) {
        throw new Error("Failed to fetch states");
      }
      const statesData = await statesRes.json();
      setStates(statesData);

      // Fetch countries
      const countriesRes = await fetch(`${base_url}/api/countries`);
      if (!countriesRes.ok) {
        throw new Error("Failed to fetch countries");
      }
      const countriesData = await countriesRes.json();
      setCountries(countriesData);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter states by selected country
  const filteredStates = selectedCountryFilter
    ? states.filter(state => String(state.country?.id || state.country?._id) === String(selectedCountryFilter))
    : states;

  // Pagination bounds correction
  useEffect(() => {
    const totalPages = Math.ceil(filteredStates.length / itemsPerPage);
    const maxPage = Math.max(1, totalPages);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredStates.length, currentPage, itemsPerPage]);

  // Paginated states
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setSname("");
    setCountryId("");
    setScapital("");
    setEditingStateId(null);
    setFormError(null);
    setSuccessMessage("");
  };

  const handleEdit = (state) => {
    setEditingStateId(state.id);
    setSname(state.name);
    setCountryId(state.country?.id || "");
    setScapital(state.capital || "");
    setFormError(null);
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage("");

    if (!countryId) {
      setFormError("Please select a country.");
      return;
    }
    if (!sname.trim()) {
      setFormError("Please enter a state name.");
      return;
    }

    try {
      setSubmitting(true);
      const isEditing = editingStateId !== null;
      const url = isEditing
        ? `${base_url}/api/states/${editingStateId}`
        : `${base_url}/api/states`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sname.trim(),
          country: countryId,
          capital: scapital.trim()
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Failed to ${isEditing ? "update" : "save"} state.`);
      }

      setSuccessMessage(`State ${isEditing ? "updated" : "saved"} successfully!`);
      setSname("");
      setCountryId("");
      setScapital("");
      setEditingStateId(null);
      
      // Refresh the states list to display the newly added/updated state with its country details
      const statesRes = await fetch(`${base_url}/api/states`);
      if (statesRes.ok) {
        const statesData = await statesRes.json();
        setStates(statesData);
      }
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        const res = await fetch(`${base_url}/api/states/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to delete state.");
        }

        // Remove the deleted state from local state list
        setStates(states.filter(s => s.id !== id));
        setSuccessMessage("State deleted successfully!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <>
      {/* Inner Navigation Header */}
      <div className="inner-navbar d-flex justify-content-between align-items-center">
        <div className="left-menu">
          <span onClick={fetchData}>Refresh List</span>
        </div>
        <div>
          <strong>State:</strong> Manage
        </div>
      </div>

      {/* Main Alert Banners */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")} aria-label="Close"></button>
        </div>
      )}

      <div className="row">
        {/* Left Side: Add State Form */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">{editingStateId ? "Edit State" : "Add State"}</h5>
            </div>
            <div className="card-body p-4">
              {formError && (
                <div className="alert alert-danger py-2" role="alert">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Country Selection */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Country</label>
                  <select
                    className="form-select"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    disabled={loading || submitting}
                  >
                    <option value="">-- Choose Country --</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Name Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">State Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter state name"
                    value={sname}
                    onChange={(e) => setSname(e.target.value)}
                    disabled={loading || submitting}
                  />
                </div>

                {/* State Capital Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">State Capital</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter state capital"
                    value={scapital}
                    onChange={(e) => setScapital(e.target.value)}
                    disabled={loading || submitting}
                  />
                </div>

                {/* Form Buttons */}
                <div className="d-flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="btn btn-success flex-grow-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {editingStateId ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      editingStateId ? "Update" : "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    {editingStateId ? "Cancel" : "Reset"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: States List Table */}
        <div className="col-md-8 mb-4">
          <div className="content-box shadow-sm border-0 bg-white p-4 rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h4 className="mb-0 fw-bold text-dark">State List</h4>
              {/* Dropdown filter for countries */}
              <div className="d-flex align-items-center gap-2">
                <label className="fw-semibold text-muted mb-0" style={{ fontSize: '0.9rem' }}>Filter:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: '150px' }}
                  value={selectedCountryFilter}
                  onChange={(e) => {
                    setSelectedCountryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading states...</p>
              </div>
            ) : filteredStates.length === 0 ? (
              <div className="alert alert-info text-center py-4" role="alert">
                {selectedCountryFilter
                  ? "No states found for the selected country."
                  : "No states found. Add some using the form on the left!"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle border mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" style={{ width: '10%' }}>#</th>
                      <th scope="col" style={{ width: '30%' }}>State Name</th>
                      <th scope="col" style={{ width: '25%' }}>Capital</th>
                      <th scope="col" style={{ width: '20%' }}>Country Name</th>
                      <th scope="col" style={{ width: '15%', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((state, index) => (
                      <tr key={state.id}>
                        <th scope="row">{indexOfFirstItem + index + 1}</th>
                        <td>{state.name}</td>
                        <td>{state.capital || <span className="text-muted fst-italic">N/A</span>}</td>
                        <td>
                          <span className="badge bg-secondary px-2 py-1.5">
                            {state.country?.name || 'N/A'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              onClick={() => handleEdit(state)}
                              className="btn btn-warning btn-sm px-2 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(state.id)}
                              className="btn btn-danger btn-sm px-2 py-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span className="text-muted small">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStates.length)} of {filteredStates.length} states
                    </span>
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}