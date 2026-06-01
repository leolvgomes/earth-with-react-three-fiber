import React from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Terra", to: "/" },
  { label: "Lua", to: "/lua" },
];

function Topbar() {
  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Voltar para a página inicial">
        <span className="brand-mark" />
        <span className="brand-text">
          Earth
          <strong>Moon</strong>
        </span>
      </Link>

      <nav className="topbar-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => (isActive ? "is-active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Topbar;