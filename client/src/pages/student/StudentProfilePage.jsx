import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../features/auth/useAuth.js';
import { useEffect, useState } from 'react';

const EMPTY_PROFILE = {
  headline: '',
  college: '',
  branch: '',
  graduationYear: '',
  phone: '',
  bio: '',
  resumeUrl: '',
};

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [saved, setSaved] = useState(false);
  const profileKey = `skillchain_student_profile_${user?._id || 'anonymous'}`;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(profileKey) || '{}');
      setForm({ ...EMPTY_PROFILE, ...stored, headline: stored.headline || '' });
    } catch {
      setForm(EMPTY_PROFILE);
    }
  }, [profileKey]);

  function updateField(event) {
    const { name, value } = event.target;
    setSaved(false);
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveProfile(event) {
    event.preventDefault();
    localStorage.setItem(profileKey, JSON.stringify({
      ...form,
      graduationYear: form.graduationYear ? Number(form.graduationYear) : '',
      userId: user?._id || null,
    }));
    setSaved(true);
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-6 px-6 py-8">
        <PageHeader eyebrow="Profile" title="Your public profile" description="Build the profile recruiters see when they open your candidate card — headline, education, links and a short bio." />
        <form onSubmit={saveProfile} className="grid gap-6 rounded-card border border-mist-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-2">
          <Input label="Name" value={user?.name || ''} readOnly hint="Managed by your account" />
          <Input label="Headline" name="headline" value={form.headline} onChange={updateField} placeholder="e.g. Frontend developer" />
          <Input label="College" name="college" value={form.college} onChange={updateField} placeholder="Your college or university" />
          <Input label="Branch" name="branch" value={form.branch} onChange={updateField} placeholder="e.g. Computer Science" />
          <Input label="Graduation year" name="graduationYear" type="number" min="2020" max="2040" value={form.graduationYear} onChange={updateField} placeholder="2027" />
          <Input label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" />
          <Input label="Resume URL" name="resumeUrl" type="url" value={form.resumeUrl} onChange={updateField} placeholder="https://" containerClassName="lg:col-span-2" />
          <div className="lg:col-span-2">
            <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-forest-700">Short bio</label>
            <textarea
              id="profile-bio"
              name="bio"
              value={form.bio}
              onChange={updateField}
              rows="5"
              maxLength="600"
              placeholder="Tell recruiters about your goals, experience and interests."
              className="w-full rounded border border-mist-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-mist-500 focus:border-clay-500"
            />
            <p className="mt-1.5 text-right text-xs text-mist-600">{form.bio.length}/600</p>
          </div>
          <div className="flex items-center gap-3 lg:col-span-2">
            <Button type="submit">Save profile</Button>
            {saved && <p role="status" className="text-sm font-medium text-forest-600">Profile saved.</p>}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
