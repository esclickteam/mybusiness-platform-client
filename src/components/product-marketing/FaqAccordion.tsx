import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Stagger, StaggerItem } from "./Reveal";

export type MarketingFaq = {
  q: string;
  a: string;
};

type Props = {
  items: MarketingFaq[];
  /** Index open on first paint. Pass -1 for all closed. */
  defaultOpen?: number;
};

export default function FaqAccordion({ items, defaultOpen = 0 }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Stagger className="pm-faq" gap={0.06} amount={0.1}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <StaggerItem
            key={item.q}
            className={`pm-faq__item${isOpen ? " is-open" : ""}`}
          >
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="pm-faq__button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span>{item.q}</span>
                <span className="pm-faq__icon" aria-hidden="true">
                  <Plus size={16} strokeWidth={3} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  className="pm-faq__answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
