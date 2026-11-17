export default function EmptyState({ title, description, action, icon }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-mist-300 bg-white px-6 py-16 text-center">
      {icon && <div className="mb-4 text-mist-500">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-forest-700">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-mist-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
