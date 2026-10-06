import React from 'react';

import {
  LayoutDashboard,
  UserRound,
  FileText,
  BarChart3,
  LogOut
} from 'lucide-react';

import NavItem from './NavItem';

export default function Sidebar({
  user,
  page,
  setPage,
  logout
}) {
  return (
    <aside>

      <div className="brand">
        <span>₹</span>
        FeeTrack
      </div>

      <div className="userbox">

        <b>
          {user.username}
        </b>

        <small>
          {user.role.toUpperCase()}
        </small>

      </div>

      <nav>

        <NavItem
          active={page === 'dashboard'}
          icon={
            <LayoutDashboard size={17} />
          }
          label="Dashboard"
          onClick={() =>
            setPage('dashboard')
          }
        />

        <NavItem
          active={page === 'students'}
          icon={
            <UserRound size={17} />
          }
          label="Students"
          onClick={() =>
            setPage('students')
          }
        />

        <NavItem
          active={page === 'fees'}
          icon={
            <FileText size={17} />
          }
          label="Fee Collection"
          onClick={() =>
            setPage('fees')
          }
        />

        {user.role === 'admin' && (
          <NavItem
            active={page === 'analytics'}
            icon={
              <BarChart3 size={17} />
            }
            label="Analytics"
            onClick={() =>
              setPage('analytics')
            }
          />
        )}

      </nav>

      <button
        className="logout"
        onClick={logout}
      >
        <LogOut size={17} />
        Logout
      </button>

    </aside>
  );
}