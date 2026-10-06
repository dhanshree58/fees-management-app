import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function StudentTable({
  students,
  setView,
  setEdit,
  remove,
  admin = false
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No.</th>
            <th>Class</th>
            <th>Total Fee</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => {
            const total = Number(s.totalFee || 0);
            const paid = Number(s.paidFee || 0);
            const remaining = Number(s.remainingFee || 0);

            const status =
              remaining <= 0
                ? 'Paid'
                : paid > 0
                ? 'Partial'
                : 'Unpaid';

            return (
              <tr
                key={s.id}
                className="student-click-row"
                onClick={() => setView(s)}
              >
                <td>
                  <div className="student-name-cell">
                    <b>{s.name}</b>
                    <small>{s.phone || '-'}</small>
                  </div>
                </td>

                <td>{s.rollNo || '-'}</td>

                <td>{s.className || '-'}</td>

                <td>
                  ₹{total.toLocaleString('en-IN')}
                </td>

                <td className="paid">
                  ₹{paid.toLocaleString('en-IN')}
                </td>

                <td className="remaining">
                  ₹{remaining.toLocaleString('en-IN')}
                </td>

                <td>
                  <span
                    className={
                      'badge ' +
                      (status === 'Paid'
                        ? 'done'
                        : status === 'Partial'
                        ? 'partial'
                        : 'pending')
                    }
                  >
                    {status}
                  </span>
                </td>

                <td>
                  <div
                    className="table-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="icon-btn"
                      title="View Student"
                      onClick={() => setView(s)}
                    >
                      <Eye size={17} />
                    </button>

                    {setEdit && (
                      <button
                        className="icon-btn"
                        title="Edit Student"
                        onClick={() => setEdit(s)}
                      >
                        <Pencil size={17} />
                      </button>
                    )}

                    {admin && remove && (
                      <button
                        className="icon-btn danger"
                        title="Delete Student"
                        onClick={() => remove(s.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {!students.length && (
            <tr>
              <td colSpan="8" className="empty">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}