import { useEffect, useState } from 'react';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const CERTIFICATES_KEY = 'skillchain_student_certificates';

export default function CertificateUpload() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '[]')); } catch { setItems([]); }
  }, []);

  function addCertificate(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const next = [...items, { id: Date.now(), title: title.trim(), issuer: issuer.trim(), status: 'Pending review' }];
    setItems(next);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(next));
    setTitle('');
    setIssuer('');
  }

  function removeCertificate(id) {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(next));
  }

  return (
    <>
      <form onSubmit={addCertificate} className="grid gap-4 rounded-card border border-mist-200 bg-white p-5 sm:grid-cols-2">
        <Input label="Certificate title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="AWS Cloud Practitioner" required />
        <Input label="Issuing organization" value={issuer} onChange={(event) => setIssuer(event.target.value)} placeholder="Amazon Web Services" />
        <div className="sm:col-span-2"><Button type="submit">Add certificate</Button></div>
      </form>
      {items.length ? (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="flex items-center justify-between rounded-card border border-mist-200 bg-white p-5">
              <div><h3 className="font-display font-semibold text-forest-700">{item.title}</h3><p className="text-sm text-mist-600">{item.issuer || 'Issuer not provided'} · {item.status}</p></div>
              <button type="button" onClick={() => removeCertificate(item.id)} className="text-xs font-semibold text-danger-600">Remove</button>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-card border border-dashed border-mist-300 bg-white py-12 text-center text-sm text-mist-600">No certificates added yet.</p>
      )}
    </>
  );
}