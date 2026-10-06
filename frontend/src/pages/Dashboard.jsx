import React from 'react';

import {
  Users,
  IndianRupee,
  Wallet,
  Receipt,
  UserRound
} from 'lucide-react';

import Stat from '../components/Stat';
import StudentTable from '../components/StudentTable';

export default function DashboardPage({
  stats,
  students,
  setPage,
  openAdd,
  setView
}) {

  return (
    <>
      <header>

        <div>
          <h2>
            Dashboard
          </h2>

          <p>
            Overview of students and fee collection.
          </p>
        </div>

        <button
          className="primary"
          onClick={openAdd}
        >
          + Add Student
        </button>

      </header>

      <section className="stats">

        <Stat
          icon={<Users />}
          title="Total Students"
          value={stats.students || 0}
        />

        <Stat
          icon={<IndianRupee />}
          title="Total Fees"
          value={
            '₹' +
            Number(
              stats.totalFee || 0
            ).toLocaleString('en-IN')
          }
        />

        <Stat
          icon={<Wallet />}
          title="Fees Paid"
          value={
            '₹' +
            Number(
              stats.paidFee || 0
            ).toLocaleString('en-IN')
          }
        />

        <Stat
          icon={<Receipt />}
          title="Remaining"
          value={
            '₹' +
            Number(
              stats.remainingFee || 0
            ).toLocaleString('en-IN')
          }
        />

      </section>

      <section className="quick-grid">

        <button
          onClick={() =>
            setPage('students')
          }
        >

          <UserRound />

          <div>

            <b>
              Manage Students
            </b>

            <span>
              Add, edit and search student records
            </span>

          </div>

        </button>

        <button
          onClick={() =>
            setPage('fees')
          }
        >

          <Receipt />

          <div>

            <b>
              Fee Collection
            </b>

            <span>
              Record payments and view pending fees
            </span>

          </div>

        </button>

      </section>

      <section className="panel">

        <div className="panel-head">

          <div>

            <h3>
              Recent Students
            </h3>

            <span>
              {students.length} records
            </span>

          </div>

          <button
            className="link-btn"
            onClick={() =>
              setPage('students')
            }
          >
            View all
          </button>

        </div>

        <StudentTable
          students={students.slice(0, 6)}
          setView={setView}
        />

      </section>
    </>
  );
}