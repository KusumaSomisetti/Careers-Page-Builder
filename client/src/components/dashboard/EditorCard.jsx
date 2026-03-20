export default function EditorCard({ title, description, actions, children }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      {actions ? <div className="mt-5">{actions}</div> : null}
    </section>
  );
}
