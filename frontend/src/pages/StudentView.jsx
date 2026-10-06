import React, { useEffect, useState } from 'react';
import {
  X,
  UserRound,
  Phone,
  GraduationCap,
  IndianRupee,
  Printer,
  CreditCard
} from 'lucide-react';

import { api } from '../utils/api';
import { printReceipt } from '../utils/receipt';

export default function StudentView({
  student,
  close,
  refresh
}) {
  const [payments, setPayments] = useState([]);

  const [summary, setSummary] = useState(student);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [form, setForm] = useState({
    amount: '',
    mode: 'Cash',
    paymentDate: new Date()
      .toISOString()
      .slice(0, 10),
    note: ''
  });

  async function loadStudentData() {
    try {
      setLoading(true);
      setError('');

      const [paymentData, summaryData] =
        await Promise.all([
          api(`/students/${student.id}/payments`),
          api(`/students/${student.id}/summary`)
        ]);

      setPayments(paymentData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudentData();
  }, [student.id]);

  async function handlePayment(e) {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid payment amount.');
      return;
    }

    try {
      setError('');

      await api(`/students/${student.id}/payments`, {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(form.amount),
          mode: form.mode,
          paymentDate: form.paymentDate,
          note: form.note
        })
      });

      setForm({
        amount: '',
        mode: 'Cash',
        paymentDate: new Date()
          .toISOString()
          .slice(0, 10),
        note: ''
      });

      await loadStudentData();

      if (refresh) {
        await refresh();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const totalFee = Number(summary.totalFee || 0);
  const paidFee = Number(summary.paidFee || 0);
  const remainingFee = Number(
    summary.remainingFee ?? totalFee - paidFee
  );

  return (
    <div className="student-view-overlay">
      <div className="student-view-modal">

        {/* HEADER */}

        <div className="student-view-header">
          <div>
            <h2>{student.name}</h2>
            <p>Student Details & Payment History</p>
          </div>

          <button
            className="close-btn"
            onClick={close}
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* STUDENT DETAILS */}

        <section className="student-details-card">

          <div className="student-profile">
            <div className="student-avatar">
              <UserRound size={28} />
            </div>

            <div>
              <h3>{summary.name || student.name}</h3>

              <span>
                Roll No: {summary.rollNo || student.rollNo}
              </span>
            </div>
          </div>

          <div className="student-info-grid">

            <div className="student-info-item">
              <UserRound size={17} />

              <div>
                <span>Student Name</span>
                <strong>
                  {summary.name || student.name}
                </strong>
              </div>
            </div>

            <div className="student-info-item">
              <GraduationCap size={17} />

              <div>
                <span>Class</span>
                <strong>
                  {summary.className ||
                    student.className ||
                    '-'}
                </strong>
              </div>
            </div>

            <div className="student-info-item">
              <CreditCard size={17} />

              <div>
                <span>Roll Number</span>
                <strong>
                  {summary.rollNo ||
                    student.rollNo ||
                    '-'}
                </strong>
              </div>
            </div>

            <div className="student-info-item">
              <Phone size={17} />

              <div>
                <span>Phone</span>
                <strong>
                  {summary.phone ||
                    student.phone ||
                    '-'}
                </strong>
              </div>
            </div>

          </div>
        </section>

        {/* FEE SUMMARY */}

        <section className="student-fee-summary">

          <div className="fee-summary-box">
            <span>Total Fee</span>
            <strong>
              ₹{totalFee.toLocaleString('en-IN')}
            </strong>
          </div>

          <div className="fee-summary-box paid-box">
            <span>Total Paid</span>
            <strong>
              ₹{paidFee.toLocaleString('en-IN')}
            </strong>
          </div>

          <div className="fee-summary-box remaining-box">
            <span>Remaining</span>
            <strong>
              ₹{remainingFee.toLocaleString('en-IN')}
            </strong>
          </div>

        </section>

        {/* ADD PAYMENT */}

        <section className="payment-form-card">

          <div className="section-title">
            <div>
              <h3>Collect Fee</h3>
              <span>
                Record a new payment
              </span>
            </div>
          </div>

          <form
            className="payment-form"
            onSubmit={handlePayment}
          >

            <label>
              Amount
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value
                  })
                }
              />
            </label>

            <label>
              Payment Mode
              <select
                value={form.mode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mode: e.target.value
                  })
                }
              >
                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cheque">
                  Cheque
                </option>
              </select>
            </label>

            <label>
              Payment Date
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paymentDate: e.target.value
                  })
                }
              />
            </label>

            <label>
              Note
              <input
                type="text"
                placeholder="Optional note"
                value={form.note}
                onChange={(e) =>
                  setForm({
                    ...form,
                    note: e.target.value
                  })
                }
              />
            </label>

            <button
              type="submit"
              className="primary payment-submit"
            >
              <IndianRupee size={17} />
              Record Payment
            </button>

          </form>
        </section>

        {/* PAYMENT HISTORY */}

        <section className="payment-history-card">

          <div className="section-title">
            <div>
              <h3>Payment History</h3>

              <span>
                {payments.length} payment
                {payments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="empty">
              Loading payment history...
            </div>
          ) : payments.length === 0 ? (
            <div className="empty">
              No payment history available.
            </div>
          ) : (
            <div className="payment-history-table">

              <table>

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Note</th>
                    <th>Receipt</th>
                  </tr>
                </thead>

                <tbody>

                  {payments.map((payment) => (

                    <tr key={payment.id}>

                      <td>
                        {payment.paymentDate
                          ? new Date(
                              payment.paymentDate
                            ).toLocaleDateString(
                              'en-IN'
                            )
                          : '-'}
                      </td>

                      <td className="paid">
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString('en-IN')}
                      </td>

                      <td>
                        <span className="payment-mode">
                          {payment.mode || 'Cash'}
                        </span>
                      </td>

                      <td>
                        {payment.note || '-'}
                      </td>

                      <td>
                        <button
                          className="icon-btn"
                          title="Print Receipt"
                          onClick={() =>
                            printReceipt(
                              payment,
                              summary
                            )
                          }
                        >
                          <Printer size={17} />
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </div>
  );
}