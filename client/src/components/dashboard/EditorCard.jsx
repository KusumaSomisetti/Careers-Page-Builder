export default function EditorCard({ eyebrow, title, description, actions, children }) {
  return (
    <section className="rounded-[30px] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5 space-y-2 border-b border-slate-200/80 pb-5">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{eyebrow}</p> : null}
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
      {actions ? <div className="mt-6 border-t border-slate-200/80 pt-5">{actions}</div> : null}
    </section>
  );
}
