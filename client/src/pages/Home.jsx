import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/countries');
      if (!res.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await res.json();
      setCountries(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/countries/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to delete country');
        }
        // Remove from local state
        setCountries(countries.filter((country) => country.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return(
    <>
      <div className="inner-navbar d-flex justify-content-between align-items-center">
        <div className="left-menu">
          <span>List</span>
        </div>
        <div>
          <strong>Country:</strong> List
        </div>
      </div>

      <div className="content-box">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="m-0"><strong>Country List</strong></h3>
          <Link to={"/add-country"} className="btn btn-primary">Add Country</Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : countries.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            No countries found. Add some to get started!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Country</th>
                  <th>Capital</th>
                  <th>Currency</th>
                  <th>Population</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country, index) => (
                  <tr key={country.id}>
                    <td>{index + 1}</td>
                    <td>{country.name}</td>
                    <td>{country.capital}</td>
                    <td>{country.currency}</td>
                    <td>{country.population}</td>
                    <td>
                      <Link to={`/edit-country/${country.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                      <button 
                        onClick={() => handleDelete(country.id)} 
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}