import React from 'react';

import {
  Users,
  IndianRupee,
  Wallet,
  Receipt
} from 'lucide-react';

import Stat from '../components/Stat';

export default function AnalyticsPage({
  students
}) {

  const totalStudents =
    students.length;

  const totalFees =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.totalFee || 0
        ),
      0
    );

  const totalPaid =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.paidFee || 0
        ),
      0
    );

  const totalRemaining =
    students.reduce(
      (sum, student) =>
        sum +
        Number(
          student.remainingFee || 0
        ),
      0
    );

  const paidStudents =
    students.filter(
      (student) =>
        Number(
          student.remainingFee || 0
        ) <= 0
    ).length;

  const partiallyPaidStudents =
    students.filter((student) => {

      const paid =
        Number(
          student.paidFee || 0
        );

      const remaining =
        Number(
          student.remainingFee || 0
        );

      return (
        paid > 0 &&
        remaining > 0
      );

    }).length;

  const unpaidStudents =
    students.filter(
      (student) =>
        Number(
          student.paidFee || 0
        ) <= 0
    ).length;

  const collectionPercentage =
    totalFees > 0
      ? Math.min(
          100,
          (totalPaid / totalFees) * 100
        )
      : 0;

  return (
    <>
      <header>

        <div>

          <h2>
            Analytics
          </h2>

          <p>
            Overview of student fee collection.
          </p>

        </div>

      </header>

      <section className="stats">

        <Stat
          icon={<Users />}
          title="Total Students"
          value={totalStudents}
        />

        <Stat
          icon={<IndianRupee />}
          title="Total Fees"
          value={
            '₹' +
            totalFees.toLocaleString(
              'en-IN'
            )
          }
        />

        <Stat
          icon={<Wallet />}
          title="Total Collected"
          value={
            '₹' +
            totalPaid.toLocaleString(
              'en-IN'
            )
          }
        />

        <Stat
          icon={<Receipt />}
          title="Outstanding"
          value={
            '₹' +
            totalRemaining.toLocaleString(
              'en-IN'
            )
          }
        />

      </section>

      <div className="analytics-grid">

        <section className="analytics-card">

          <div className="analytics-card-head">

            <div>

              <h3>
                Collection Progress
              </h3>

              <span>
                Total fees collected
              </span>

            </div>

            <strong className="analytics-percentage">
              {collectionPercentage.toFixed(1)}%
            </strong>

          </div>

          <div className="progress-container">

            <div
              className="progress-bar"
              style={{
                width:
                  `${collectionPercentage}%`
              }}
            />

          </div>

          <div className="progress-info">

            <span>
              Collected ₹
              {totalPaid.toLocaleString(
                'en-IN'
              )}
            </span>

            <span>
              Total ₹
              {totalFees.toLocaleString(
                'en-IN'
              )}
            </span>

          </div>

        </section>

        <section className="analytics-card">

          <div className="analytics-card-head">

            <div>

              <h3>
                Payment Status
              </h3>

              <span>
                Students by payment status
              </span>

            </div>

          </div>

          <div className="status-list">

            <div className="status-row">

              <div className="status-name">

                <span className="status-dot paid-dot" />

                <span>
                  Fully Paid
                </span>

              </div>

              <strong>
                {paidStudents}
              </strong>

            </div>

            <div className="status-row">

              <div className="status-name">

                <span className="status-dot partial-dot" />

                <span>
                  Partially Paid
                </span>

              </div>

              <strong>
                {partiallyPaidStudents}
              </strong>

            </div>

            <div className="status-row">

              <div className="status-name">

                <span className="status-dot unpaid-dot" />

                <span>
                  Unpaid
                </span>

              </div>

              <strong>
                {unpaidStudents}
              </strong>

            </div>

          </div>

        </section>

      </div>

      <section className="panel analytics-panel">

        <div className="panel-head">

          <div>

            <h3>
              Student Payment Status
            </h3>

            <span>
              Fee collection details
            </span>

          </div>

        </div>

        <div className="table-wrap">

          <table>

            <thead>

              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Remaining</th>
                <th>Collection %</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {students.map((student) => {

                const total =
                  Number(
                    student.totalFee || 0
                  );

                const paid =
                  Number(
                    student.paidFee || 0
                  );

                const remaining =
                  Number(
                    student.remainingFee || 0
                  );

                const percentage =
                  total > 0
                    ? Math.min(
                        100,
                        (paid / total) * 100
                      )
                    : 0;

                let status = 'Unpaid';

                if (remaining <= 0) {
                  status = 'Paid';
                } else if (paid > 0) {
                  status = 'Partial';
                }

                return (
                  <tr key={student.id}>

                    <td>
                      <strong>
                        {student.name}
                      </strong>
                    </td>

                    <td>
                      {student.className || '-'}
                    </td>

                    <td>
                      ₹
                      {total.toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td>
                      ₹
                      {paid.toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td>
                      ₹
                      {remaining.toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td>
                      {percentage.toFixed(1)}%
                    </td>

                    <td>

                      <span
                        className={
                          'status ' +
                          status.toLowerCase()
                        }
                      >
                        {status}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </section>
    </>
  );
}