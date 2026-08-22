import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqItems } from '@/data/content';

function FAQRow({ item, index }: { item: typeof faqItems[number]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="reveal border-b border-ink-700/60"
      style={{ transitionDelay: `${(index % 4) * 60}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg font-medium text-ink-100 transition-colors hover:text-gold-300 sm:text-xl">
          {item.question}
        </span>
        <span className="flex-shrink-0 text-gold-400">
          {open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-400 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-ink-300">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="section-py relative bg-ink-900/40">
      <div className="container-px mx-auto max-w-3xl">
        <div className="reveal mb-12 text-center">
          <p className="eyebrow mb-6">Questions & Answers</p>
          <h2 className="heading-display text-4xl text-ink-50 sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="reveal">
          {faqItems.map((item, i) => (
            <FAQRow key={item.question} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
