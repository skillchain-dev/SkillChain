import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useEffect, useState } from 'react';

const COMPANY_KEY = 'skillchain_company_profile';

export default function CompanyProfilePage() {
  const [form, setForm] = useState({ name: '', website: '', location: '', description: '' });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try { setForm({ name: '', website: '', location: '', description: '', ...JSON.parse(localStorage.getItem(COMPANY_KEY) || '{}') }); } catch {}
  }, []);
  function save(event) {
    event.preventDefault();
    localStorage.setItem(COMPANY_KEY, JSON.stringify(form));
    setSaved(true);
  }
  return (
    <DashboardLayout role="recruiter">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Company profile" title="Company profile" description="Tell candidates about your company — logo, description and the roles you're hiring for." />
        <form onSubmit={save} className="grid gap-5 rounded-card border border-mist-200 bg-white p-5 sm:grid-cols-2">
          <Input label="Company name" value={form.name} onChange={(e) => { setSaved(false); setForm({ ...form, name: e.target.value }); }} required />
          <Input label="Website" type="url" value={form.website} onChange={(e) => { setSaved(false); setForm({ ...form, website: e.target.value }); }} placeholder="https://" />
          <Input label="Location" value={form.location} onChange={(e) => { setSaved(false); setForm({ ...form, location: e.target.value }); }} placeholder="City, country" containerClassName="sm:col-span-2" />
          <div className="sm:col-span-2">
            <label htmlFor="company-description" className="mb-1.5 block text-sm font-medium text-forest-700">About the company</label>
            <textarea id="company-description" rows="5" value={form.description} onChange={(e) => { setSaved(false); setForm({ ...form, description: e.target.value }); }} className="w-full rounded border border-mist-300 px-3.5 py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit">Save company profile</Button>{saved && <p role="status" className="text-sm font-medium text-forest-600">Saved.</p>}</div>
        </form>
      </div>
    </DashboardLayout>
  );
}
