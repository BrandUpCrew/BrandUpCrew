import { StaggerGroup, StaggerItem } from "@/components/site/animated";

export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <StaggerGroup className="faq-list" stagger={0.06}>
      {items.map((item, index) => (
        <StaggerItem key={item.question}>
          <details className="faq-item">
            <summary>
              <span className="faq-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.question}</span>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{item.answer}</p>
          </details>
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
