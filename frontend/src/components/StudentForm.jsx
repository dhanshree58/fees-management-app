import React, { useEffect, useState } from 'react';

import Modal from './Modal';

import { api } from '../utils/api';

export default function StudentForm({
  student,
  close,
  saved
}) {

  const [form, setForm] = useState({
    name: '',
    rollNo: '',
    className: '',
    phone: '',
    totalFee: ''
  });

  const [error, setError] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (student) {

      setForm({
        name: student.name || '',
        rollNo: student.rollNo || '',
        className:
          student.className || '',
        phone: student.phone || '',
        totalFee:
          student.totalFee || ''
      });

    }

  }, [student]);

  function update(field, value) {

    setForm((previous) => ({
      ...previous,
      [field]: value
    }));

  }

  async function submit(e) {

    e.preventDefault();

    setError('');
    setSaving(true);

    try {

      const body = {
        name: form.name,
        rollNo: form.rollNo,
        className: form.className,
        phone: form.phone,
        totalFee: Number(form.totalFee || 0)
      };

      if (student) {

        await api(
          '/students/' + student.id,
          {
            method: 'PUT',
            body: JSON.stringify(body)
          }
        );

      } else {

        await api(
          '/students',
          {
            method: 'POST',
            body: JSON.stringify(body)
          }
        );

      }

      await saved();

      close();

    } catch (e) {

      setError(e.message);

    } finally {

      setSaving(false);

    }
  }

  return (
    <Modal
      title={
        student
          ? 'Edit Student'
          : 'Add Student'
      }
      close={close}
    >

      <form
        onSubmit={submit}
        className="student-form"
      >

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="form-grid">

          <label>
            Student Name

            <input
              required
              value={form.name}
              onChange={(e) =>
                update(
                  'name',
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Roll Number

            <input
              required
              value={form.rollNo}
              onChange={(e) =>
                update(
                  'rollNo',
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Class

            <input
              value={form.className}
              onChange={(e) =>
                update(
                  'className',
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Phone

            <input
              value={form.phone}
              onChange={(e) =>
                update(
                  'phone',
                  e.target.value
                )
              }
            />
          </label>

        </div>

        <label>
          Total Annual Fee

          <input
            required
            type="number"
            min="0"
            value={form.totalFee}
            onChange={(e) =>
              update(
                'totalFee',
                e.target.value
              )
            }
          />
        </label>

        <div className="modal-actions">

          <button
            type="button"
            onClick={close}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Student'}
          </button>

        </div>

      </form>

    </Modal>
  );
}