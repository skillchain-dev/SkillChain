import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { projectsApi } from '../../features/projects/api.js';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [values, setValues] = useState({ title: '', description: '', technologies: '', githubLink: '', liveDemoLink: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    try {
      const { data } = await projectsApi.list();
      setProjects(data.data);
    } catch (requestError) {
      setError(requestError.message || 'Could not load projects.');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await projectsApi.create({ ...values, technologies: values.technologies.split(',').map((item) => item.trim()).filter(Boolean) });
      setValues({ title: '', description: '', technologies: '', githubLink: '', liveDemoLink: '' });
      await load();
    } catch (requestError) {
      setError(requestError.message || 'Could not save project.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    try {
      await projectsApi.remove(id);
      setProjects((current) => current.filter((project) => project._id !== id));
    } catch (requestError) {
      setError(requestError.message || 'Could not delete project.');
    }
  }

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Projects" title="Your projects" description="Showcase projects with descriptions, links and the skills each one demonstrates." />
        <form className="form-card space-y-4" onSubmit={submit}>
          <h2 className="font-display text-lg font-semibold">Add a project</h2>
          {error && <p role="alert" className="error">{error}</p>}
          <label>Title<input required value={values.title} onChange={update('title')} /></label>
          <label>Description<textarea rows="4" value={values.description} onChange={update('description')} /></label>
          <label>Technologies, comma separated<input value={values.technologies} onChange={update('technologies')} /></label>
          <label>GitHub URL<input type="url" value={values.githubLink} onChange={update('githubLink')} /></label>
          <label>Live demo URL<input type="url" value={values.liveDemoLink} onChange={update('liveDemoLink')} /></label>
          <button className="button primary" disabled={saving}>{saving ? 'Saving…' : 'Add project'}</button>
        </form>
        <section className="space-y-4">
          {projects.map((project) => (
            <article key={project._id} className="form-card flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{project.title}</h2>
                <p className="muted">{project.description}</p>
                <p className="muted">{project.technologies?.join(', ')}</p>
                <div className="flex gap-4">
                  {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub</a>}
                  {project.liveDemoLink && <a href={project.liveDemoLink} target="_blank" rel="noreferrer">Live demo</a>}
                </div>
              </div>
              <button type="button" className="button danger" onClick={() => remove(project._id)}>Delete</button>
            </article>
          ))}
          {!projects.length && <p className="muted">No projects added yet.</p>}
        </section>
      </div>
    </DashboardLayout>
  );
}
