import { company } from "../data/careers";
import SectionHeading from "./SectionHeading";

const values = [
  "Small teams, high trust, and clear ownership.",
  "Thoughtful pace with strong product taste.",
  "A hiring experience that respects people’s time."
];

export default function AboutSection() {
  return (
    <section id="about" className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <SectionHeading
          eyebrow="About"
          title="A calm, focused place to do the best work of your career."
          description={company.description}
        />

        <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="space-y-4">
            {values.map((value) => (
              <div
                key={value}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
