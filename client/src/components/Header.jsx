import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return(
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Country App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/">Country</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/state">State</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/city">City</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}