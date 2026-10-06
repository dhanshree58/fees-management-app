import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Printer,
  ChevronDown
} from 'lucide-react';

import StudentTable from '../components/StudentTable';

export default function StudentsPage({
  students,
  openAdd,
  setEdit,
  setView,
  remove,
  user,
  searchPlaceholder
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /*
   * Determine student payment status
   */
  function getStatus(student) {
    const total = Number(student.totalFee || 0);
    const paid = Number(student.paidFee || 0);
    const remaining = Number(
      student.remainingFee ?? total - paid
    );

    if (remaining <= 0) {
      return 'paid';
    }

    if (paid > 0) {
      return 'partial';
    }

    return 'unpaid';
  }

  /*
   * Search + Status Filter
   */
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const searchText = (
        (s.name || '') +
        ' ' +
        (s.rollNo || '') +
        ' ' +
        (s.className || '') +
        ' ' +
        (s.phone || '')
      ).toLowerCase();

      const matchesSearch =
        searchText.includes(search.toLowerCase());

      const status = getStatus(s);

      const matchesStatus =
        statusFilter === 'all' ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  /*
   * Filter counts
   */
  const allCount = students.length;

  const paidCount = students.filter(
    (s) => getStatus(s) === 'paid'
  ).length;

  const partialCount = students.filter(
    (s) => getStatus(s) === 'partial'
  ).length;

  const unpaidCount = students.filter(
    (s) => getStatus(s) === 'unpaid'
  ).length;

  /*
   * Print current filtered list
   */
  function printStudentList() {
    const title =
      statusFilter === 'all'
        ? 'All Students'
        : statusFilter === 'paid'
        ? 'Fully Paid Students'
        : statusFilter === 'partial'
        ? 'Partially Paid Students'
        : 'Not Paid Students';

    const rows = filtered
      .map((s, index) => {
        const total = Number(s.totalFee || 0);
        const paid = Number(s.paidFee || 0);
        const remaining = Number(
          s.remainingFee ?? total - paid
        );

        const status = getStatus(s);

        const statusText =
          status === 'paid'
            ? 'Fully Paid'
            : status === 'partial'
            ? 'Partially Paid'
            : 'Not Paid';

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(s.name || '-')}</td>
            <td>${escapeHtml(s.rollNo || '-')}</td>
            <td>${escapeHtml(s.className || '-')}</td>
            <td>₹${total.toLocaleString('en-IN')}</td>
            <td>₹${paid.toLocaleString('en-IN')}</td>
            <td>₹${remaining.toLocaleString('en-IN')}</td>
            <td>${statusText}</td>
          </tr>
        `;
      })
      .join('');

    const printWindow = window.open(
      '',
      '_blank',
      'width=1100,height=700'
    );

    if (!printWindow) {
      alert(
        'Please allow pop-ups to print the student list.'
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>
        <head>
          <title>${title}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, Helvetica, sans-serif;
              color: #111827;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
            }

            .header h1 {
              margin: 0 0 8px;
              font-size: 24px;
            }

            .header p {
              margin: 0;
              color: #6b7280;
              font-size: 13px;
            }

            .summary {
              display: flex;
              gap: 30px;
              margin-bottom: 20px;
              padding: 12px;
              border: 1px solid #ddd;
            }

            .summary-item {
              font-size: 13px;
            }

            .summary-item strong {
              font-size: 16px;
              margin-left: 5px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              background: #f3f4f6;
              font-size: 11px;
              text-align: left;
              padding: 10px;
              border: 1px solid #d1d5db;
            }

            td {
              font-size: 12px;
              padding: 9px 10px;
              border: 1px solid #d1d5db;
            }

            .footer {
              margin-top: 30px;
              font-size: 11px;
              color: #6b7280;
              text-align: right;
            }

            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>

        <body>

          <div class="header">
            <h1>FeeTrack</h1>
            <p>${title}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              Students:
              <strong>${filtered.length}</strong>
            </div>

            <div class="summary-item">
              Printed:
              <strong>
                ${new Date().toLocaleDateString('en-IN')}
              </strong>
            </div>
          </div>

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              ${
                rows ||
                `
                <tr>
                  <td colspan="8" style="text-align:center">
                    No students found
                  </td>
                </tr>
                `
              }
            </tbody>

          </table>

          <div class="footer">
            FeeTrack Student Fee Management System
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  return (
    <>
      {/* HEADER */}

      <header>
        <div>
          <h2>Students</h2>

          <p>
            Manage student records and annual fees.
          </p>
        </div>

        <button
          className="primary"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Student
        </button>
      </header>

      {/* ALL STUDENTS */}

      <section className="panel">

        <div className="panel-head">

          <div>
            <h3>All Students</h3>

            <span>
              {filtered.length} of {students.length} records
            </span>
          </div>

          <div className="students-toolbar">

            {/* SEARCH */}

            <div className="search">
              <Search size={17} />

              <input
                placeholder={
                  searchPlaceholder ||
                  'Search student, roll no, class...'
                }
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* FILTER */}

            <div className="filter-wrapper">

              <select
                className="student-filter"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="all">
                  All Students ({allCount})
                </option>

                <option value="paid">
                  Fully Paid ({paidCount})
                </option>

                <option value="partial">
                  Partially Paid ({partialCount})
                </option>

                <option value="unpaid">
                  Not Paid ({unpaidCount})
                </option>
              </select>

              <ChevronDown
                size={15}
                className="filter-icon"
              />

            </div>

            {/* PRINT */}

            <button
              className="secondary-btn"
              onClick={printStudentList}
              title="Print student list"
            >
              <Printer size={16} />
              Print List
            </button>

          </div>

        </div>

        {/* FILTER BUTTONS */}

        <div className="student-status-filters">

          <button
            className={
              statusFilter === 'all'
                ? 'status-filter active'
                : 'status-filter'
            }
            onClick={() =>
              setStatusFilter('all')
            }
          >
            All
            <span>{allCount}</span>
          </button>

          <button
            className={
              statusFilter === 'paid'
                ? 'status-filter paid active'
                : 'status-filter paid'
            }
            onClick={() =>
              setStatusFilter('paid')
            }
          >
            Fully Paid
            <span>{paidCount}</span>
          </button>

          <button
            className={
              statusFilter === 'partial'
                ? 'status-filter partial active'
                : 'status-filter partial'
            }
            onClick={() =>
              setStatusFilter('partial')
            }
          >
            Partially Paid
            <span>{partialCount}</span>
          </button>

          <button
            className={
              statusFilter === 'unpaid'
                ? 'status-filter unpaid active'
                : 'status-filter unpaid'
            }
            onClick={() =>
              setStatusFilter('unpaid')
            }
          >
            Not Paid
            <span>{unpaidCount}</span>
          </button>

        </div>

        {/* TABLE */}

        <StudentTable
          students={filtered}
          setView={setView}
          setEdit={setEdit}
          remove={remove}
          admin={user.role === 'admin'}
        />

      </section>
    </>
  );
}


/*
 * Prevent HTML from being injected into
 * the print document.
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}