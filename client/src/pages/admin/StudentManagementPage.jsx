import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getStudents } from '../../features/certificates/api.js';

export default function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getStudents()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message || 'Could not load students directory.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((s) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return s.name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term);
  });

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader
          eyebrow="Admin / Directory"
          title="Student Directory"
          description="Manage and inspect registered students, their account statuses and platform registration dates."
          actions={
            <span className="inline-flex items-center rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-800">
              {students.length} students enrolled
            </span>
          }
        />

        {error && (
          <div role="alert" className="rounded-md border border-danger-500/30 bg-danger-50 p-4 text-sm text-danger-700">
            {error}
          </div>
        )}

        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-mist-300 bg-white px-3.5 py-2 text-sm text-ink focus:border-clay-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-sm text-mist-500 animate-pulse">Loading student records…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-card border border-mist-200 bg-white p-10 text-center">
            <h3 className="font-display text-lg font-semibold text-forest-700">No students found</h3>
            <p className="mt-1 text-sm text-mist-600">No student records match the search filter.</p>
          </div>
        ) : (
          <div className="rounded-card border border-mist-200 bg-white overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream/60 border-b border-mist-200 text-xs font-semibold uppercase tracking-wider text-mist-600">
                  <tr>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Email Address</th>
                    <th className="px-6 py-3.5">Account Role</th>
                    <th className="px-6 py-3.5">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {filtered.map((student) => (
                    <tr key={student._id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-forest-800">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-mist-700">
                        {student.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-medium text-forest-700 border border-forest-200">
                          Student
                        </span>
                      </td>
                      <td className="px-6 py-4 text-mist-600 text-xs">
                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
