import React, {
  useState
} from 'react';

import {
  IndianRupee,
  Receipt,
  Users,
  Search
} from 'lucide-react';

import Stat from '../components/Stat';
import StudentTable
  from '../components/StudentTable';

export default function FeesPage({
  students,
  setView
}) {

  const [search, setSearch] =
    useState('');

  const paid =
    students.reduce(
      (total, student) =>
        total +
        Number(
          student.paidFee || 0
        ),
      0
    );

  const remaining =
    students.reduce(
      (total, student) =>
        total +
        Number(
          student.remainingFee || 0
        ),
      0
    );

  const pending =
    students.filter(
      (student) =>
        Number(
          student.remainingFee || 0
        ) > 0
    ).length;

  const filtered =
    students.filter((student) => {

      const text = [
        student.name,
        student.rollNo,
        student.className
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );

    });

  return (
    <>
      <header>

        <div>

          <h2>
            Fee Collection
          </h2>

          <p>
            Record payments and track outstanding fees.
          </p>

        </div>

      </header>

      <section className="stats compact">

        <Stat
          icon={<IndianRupee />}
          title="Collected"
          value={
            '₹' +
            paid.toLocaleString('en-IN')
          }
        />

        <Stat
          icon={<Receipt />}
          title="Outstanding"
          value={
            '₹' +
            remaining.toLocaleString('en-IN')
          }
        />

        <Stat
          icon={<Users />}
          title="Pending Students"
          value={pending}
        />

      </section>

      <section className="panel">

        <div className="panel-head">

          <div>

            <h3>
              Fee Status
            </h3>

            <span>
              Click a student to record a payment
            </span>

          </div>

          <div className="search">

            <Search size={18} />

            <input
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <StudentTable
          students={filtered}
          setView={setView}
        />

      </section>
    </>
  );
}