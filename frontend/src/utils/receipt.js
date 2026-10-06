function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function printReceipt(payment, student) {

  const currentPayment =
    Number(payment.amount || 0);

  const receiptNumber =
    `REC-${payment.id}-${new Date().getFullYear()}`;

  const paymentDate =
    new Date(
      payment.paymentDate
    ).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const html = `
<!DOCTYPE html>

<html>

<head>

  <title>
    Fee Receipt - ${receiptNumber}
  </title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px;
      background: white;
      color: #111827;
      font-family:
        Arial,
        Helvetica,
        sans-serif;
    }

    .receipt {

      width: 700px;
      max-width: 100%;
      margin: auto;

      border: 1px solid #d1d5db;

      padding: 35px;
    }

    .header {

      text-align: center;

      border-bottom:
        2px solid #111827;

      padding-bottom: 18px;
    }

    .header h1 {

      margin: 0;

      font-size: 28px;
    }

    .header p {

      margin: 5px 0;

      color: #6b7280;

      font-size: 13px;
    }

    .title {

      text-align: center;

      font-size: 20px;

      font-weight: bold;

      margin: 25px 0;
    }

    .info {

      display: grid;

      grid-template-columns:
        1fr 1fr;

      gap: 15px;

      margin-bottom: 20px;
    }

    .info-item {

      padding: 8px;
    }

    .info-item span {

      display: block;

      color: #6b7280;

      font-size: 11px;

      margin-bottom: 4px;
    }

    .info-item strong {

      font-size: 14px;
    }

    .student {

      border:
        1px solid #d1d5db;

      padding: 15px;

      margin-bottom: 20px;
    }

    .student-grid {

      display: grid;

      grid-template-columns:
        1fr 1fr;

      gap: 12px;
    }

    table {

      width: 100%;

      border-collapse:
        collapse;

      margin-top: 20px;
    }

    th,
    td {

      border:
        1px solid #d1d5db;

      padding: 12px;

      font-size: 13px;
    }

    th {

      background: #f3f4f6;

      text-align: left;
    }

    .right {

      text-align: right;
    }

    .payment {

      border:
        1px solid #d1d5db;

      padding: 15px;

      margin-top: 20px;
    }

    .payment h3 {

      margin-top: 0;

      font-size: 15px;
    }

    .payment p {

      font-size: 13px;

      margin: 7px 0;
    }

    .footer {

      margin-top: 70px;

      display: flex;

      justify-content:
        space-between;

      align-items:
        flex-end;
    }

    .signature {

      width: 180px;

      text-align: center;
    }

    .line {

      border-top:
        1px solid #111827;

      margin-bottom: 7px;
    }

    .signature span {

      font-size: 11px;

      color: #6b7280;
    }

    .thank {

      text-align: center;

      margin-top: 30px;

      color: #6b7280;

      font-size: 12px;
    }

    @media print {

      body {
        padding: 0;
      }

      .receipt {

        border: none;

        width: 100%;
      }
    }

  </style>

</head>

<body>

  <div class="receipt">

    <div class="header">

      <h1>
        FeeTrack
      </h1>

      <p>
        Student Fee Management System
      </p>

      <p>
        Official Fee Payment Receipt
      </p>

    </div>

    <div class="title">
      FEE RECEIPT
    </div>

    <div class="info">

      <div class="info-item">

        <span>
          Receipt Number
        </span>

        <strong>
          ${receiptNumber}
        </strong>

      </div>

      <div
        class="info-item"
        style="text-align:right"
      >

        <span>
          Payment Date
        </span>

        <strong>
          ${paymentDate}
        </strong>

      </div>

    </div>

    <div class="student">

      <div class="student-grid">

        <div class="info-item">

          <span>
            Student Name
          </span>

          <strong>
            ${escapeHtml(student.name)}
          </strong>

        </div>

        <div class="info-item">

          <span>
            Roll Number
          </span>

          <strong>
            ${escapeHtml(student.rollNo)}
          </strong>

        </div>

        <div class="info-item">

          <span>
            Class
          </span>

          <strong>
            ${escapeHtml(
              student.className || '-'
            )}
          </strong>

        </div>

        <div class="info-item">

          <span>
            Phone
          </span>

          <strong>
            ${escapeHtml(
              student.phone || '-'
            )}
          </strong>

        </div>

      </div>

    </div>

    <!-- PAYMENT TABLE -->

    <table>

      <thead>

        <tr>

          <th>
            Description
          </th>

          <th class="right">
            Amount
          </th>

        </tr>

      </thead>

      <tbody>

        <tr>

          <td>
            Payment Received
          </td>

          <td class="right">

            ₹${currentPayment.toLocaleString(
              'en-IN'
            )}

          </td>

        </tr>

      </tbody>

    </table>

    <!-- PAYMENT DETAILS -->

    <div class="payment">

      <h3>
        Payment Details
      </h3>

      <p>

        <strong>
          Payment Mode:
        </strong>

        ${escapeHtml(
          payment.mode || '-'
        )}

      </p>

      <p>

        <strong>
          Payment Date:
        </strong>

        ${paymentDate}

      </p>

      ${
        payment.note
          ? `
            <p>

              <strong>
                Note:
              </strong>

              ${escapeHtml(
                payment.note
              )}

            </p>
          `
          : ''
      }

    </div>

    <div class="footer">

      <div>

        <strong>
          FeeTrack
        </strong>

        <br />

        <span
          style="
            font-size:11px;
            color:#6b7280
          "
        >
          Computer Generated Receipt
        </span>

      </div>

      <div class="signature">

        <div class="line"></div>

        <span>
          Authorized Signature
        </span>

      </div>

    </div>

    <div class="thank">

      Thank you for your payment.

    </div>

  </div>

</body>

</html>
`;

  /*
   * Hidden iframe
   * This avoids the blank-print-preview
   * problem caused by the React page.
   */

  const iframe =
    document.createElement('iframe');

  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';

  iframe.style.width = '1px';
  iframe.style.height = '1px';

  iframe.style.border = '0';
  iframe.style.opacity = '0';

  iframe.style.pointerEvents = 'none';

  document.body.appendChild(iframe);

  const iframeDocument =
    iframe.contentDocument ||
    iframe.contentWindow.document;

  iframeDocument.open();

  iframeDocument.write(html);

  iframeDocument.close();

  setTimeout(() => {

    iframe.contentWindow.focus();

    iframe.contentWindow.print();

    setTimeout(() => {

      if (iframe.parentNode) {
        iframe.parentNode.removeChild(
          iframe
        );
      }

    }, 1000);

  }, 500);
}