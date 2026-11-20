import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useEffect, useState } from 'react';

const PROJECTS_KEY = 'skillchain_student_projects';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [draft, setDraft] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    try { setProjects(JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]')); } catch { setProjects([]); }
  }, []);

  function addProject(event) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const next = [...projects, { ...draft, id: Date.now(), title: draft.title.trim() }];
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
    setDraft({ title: '', description: '', url: '' });
  }

  function removeProject(id) {
    const next = projects.filter((project) => project.id !== id);
    setProjects(next);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(next));
  }

  return (
    <DashboardLayout role="student">
      <div className="mx-auto max-w-shell space-y-8 px-6 py-8">
        <PageHeader eyebrow="Projects" title="Your projects" description="Showcase projects with descriptions, links and the skills each one demonstrates." />
        <form onSubmit={addProject} className="grid gap-4 rounded-card border border-mist-200 bg-white p-5 sm:grid-cols-2">
          <Input label="Project title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Placement dashboard" required />
          <Input label="Project URL" value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} placeholder="https://github.com/..." />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-forest-700" htmlFor="project-description">Description</label>
            <textarea id="project-description" rows="3" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="w-full rounded border border-mist-300 px-3.5 py-2.5 text-sm" />
          </div>
          <div className="sm:col-span-2"><Button type="submit">Add project</Button></div>
        </form>
        {projects.length ? (
          <div className="grid gap-4 sm:grid-cols-2">{projects.map((project) => (
            <article key={project.id} className="rounded-card border border-mist-200 bg-white p-5">
              <h3 className="font-display font-semibold text-forest-700">{project.title}</h3>
              {project.description && <p className="mt-2 text-sm text-mist-600">{project.description}</p>}
              {project.url && <a className="mt-3 block break-all text-sm font-medium text-clay-600" href={project.url} target="_blank" rel="noreferrer">View project</a>}
              <button type="button" onClick={() => removeProject(project.id)} className="mt-4 text-xs font-semibold text-danger-600">Remove</button>
            </article>
          ))}</div>
        ) : <EmptyState title="No projects yet" description="Add a project to start building your public portfolio." />}
      </div>
    </DashboardLayout>
  );
}
