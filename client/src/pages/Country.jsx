import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Country() {
  const base_url = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [cname, setCname] = useState("");
  const [capital, setCapital] = useState("");
  const [currency, setCurrency] = useState("");
  const [population, setPopulation] = useState("");
  const [status, setStatus] = useState(1); // Visual/UI only state (ignored by current DB schema)

  // Status states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // If ID exists, fetch existing country details (Edit Mode)
  useEffect(() => {
    if (id) {
      const fetchCountry = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await fetch(`${base_url}/api/countries/${id}`);
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error("Country not found");
            }
            throw new Error("Failed to fetch country details");
          }
          const data = await res.json();
          setCname(data.name || "");
          setCapital(data.capital || "");
          setCurrency(data.currency || "");
          setPopulation(data.population || "");
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCountry();
    }
  }, [id, base_url]);

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setCname("");
    setCapital("");
    setCurrency("");
    setPopulation("");
    setStatus(1);
    setError(null);
    setSuccessMessage("");
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!cname.trim()) {
      setError("Country Name is required.");
      return;
    }

    const countryPayload = {
      name: cname.trim(),
      capital: capital.trim(),
      currency: currency.trim(),
      population: population.trim(),
    };

    try {
      setSubmitting(true);
      const url = id ? `${base_url}/api/countries/${id}` : `${base_url}/api/countries`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(countryPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save country.");
      }

      setSuccessMessage(id ? "Country updated successfully! Redirecting..." : "Country saved successfully! Redirecting...");
      
      // Navigate back to countries list after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-primary text-white py-3">
        <h4 className="mb-0 fw-bold">{id ? "Edit Country" : "Add Country"}</h4>
      </div>

      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading country details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm}>
            <div className="row">
              {/* Country Name */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Country Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Country"
                  value={cname}
                  onChange={(e) => setCname(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Capital */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Capital</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Capital"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Currency */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Currency</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Population */}
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Population</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Population"
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Status (UI only) */}
              <div className="col-md-3 mb-3">
                <label className="form-label d-block fw-semibold">Status</label>
                <div className="form-check form-check-inline mt-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="active"
                    value="1"
                    checked={status === 1}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    disabled={submitting}
                  />
                  <label className="form-check-label" htmlFor="active">
                    Active
                  </label>
                </div>

                <div className="form-check form-check-inline mt-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id="inactive"
                    value="0"
                    checked={status === 0}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    disabled={submitting}
                  />
                  <label className="form-check-label" htmlFor="inactive">
                    Inactive
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="btn btn-success me-2 px-4"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={handleReset}
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}