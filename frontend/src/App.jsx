import React, {
  useEffect,
  useState
} from 'react';

import {
  X
} from 'lucide-react';

import Login from './pages/Login';

import DashboardPage
  from './pages/Dashboard';

import StudentsPage
  from './pages/Students';

import FeesPage
  from './pages/Fees';

import AnalyticsPage
  from './pages/Analytics';

import StudentView
  from './pages/StudentView';

import Sidebar
  from './components/Sidebar';

import StudentForm
  from './components/StudentForm';

import { api } from './utils/api';

export default function App() {

  const [user, setUser] =
    useState(() =>
      JSON.parse(
        localStorage.getItem(
          'user'
        ) || 'null'
      )
    );

  if (!user) {

    return (
      <Login
        onLogin={setUser}
      />
    );

  }

  return (
    <DashboardLayout
      user={user}
      logout={() => {

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'user'
        );

        setUser(null);

      }}
    />
  );
}

function DashboardLayout({
  user,
  logout
}) {

  const [page, setPage] =
    useState('dashboard');

  const [students, setStudents] =
    useState([]);

  const [stats, setStats] =
    useState({});

  const [showForm, setShowForm] =
    useState(false);

  const [editStudent, setEditStudent] =
    useState(null);

  const [viewStudent, setViewStudent] =
    useState(null);

  const [error, setError] =
    useState('');

  async function load() {

    try {

      setError('');

      const [
        studentData,
        dashboardData
      ] = await Promise.all([

        api('/students'),

        api('/dashboard')

      ]);

      setStudents(
        studentData
      );

      setStats(
        dashboardData
      );

    } catch (e) {

      setError(
        e.message
      );

    }
  }

  useEffect(() => {

    load();

  }, []);

  function openAdd() {

    setEditStudent(null);

    setShowForm(true);

  }

  function openEdit(student) {

    setEditStudent(student);

    setShowForm(true);

  }

  async function removeStudent(id) {

    const confirmed =
      window.confirm(
        'Delete this student and all payment records?'
      );

    if (!confirmed) {
      return;
    }

    try {

      await api(
        `/students/${id}`,
        {
          method: 'DELETE'
        }
      );

      await load();

    } catch (e) {

      setError(
        e.message
      );

    }
  }

  function renderPage() {

    if (page === 'dashboard') {

      return (
        <DashboardPage
          stats={stats}
          students={students}
          setPage={setPage}
          openAdd={openAdd}
          setView={setViewStudent}
        />
      );

    }

    if (page === 'students') {

      return (
        <StudentsPage
          students={students}
          openAdd={openAdd}
          setEdit={openEdit}
          setView={setViewStudent}
          remove={removeStudent}
          user={user}
        />
      );

    }

    if (page === 'fees') {

      return (
        <FeesPage
          students={students}
          setView={setViewStudent}
        />
      );

    }

    if (
      page === 'analytics' &&
      user.role === 'admin'
    ) {

      return (
        <AnalyticsPage
          students={students}
        />
      );

    }

    /*
     * If staff somehow tries to access
     * analytics, return to dashboard.
     */

    if (
      page === 'analytics' &&
      user.role !== 'admin'
    ) {

      return (
        <DashboardPage
          stats={stats}
          students={students}
          setPage={setPage}
          openAdd={openAdd}
          setView={setViewStudent}
        />
      );

    }

    return null;
  }

  return (

    <div className="app">

      <Sidebar
        user={user}
        page={page}
        setPage={setPage}
        logout={logout}
      />

      <main>

        {error && (

          <div className="error top">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError('')
              }
            >

              <X size={16} />

            </button>

          </div>

        )}

        {renderPage()}

      </main>

      {showForm && (

        <StudentForm
          student={editStudent}
          close={() =>
            setShowForm(false)
          }
          saved={load}
        />

      )}

      {viewStudent && (

        <StudentView
          student={viewStudent}
          close={() =>
            setViewStudent(null)
          }
          refresh={load}
        />

      )}

    </div>
  );
}