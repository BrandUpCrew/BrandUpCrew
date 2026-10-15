export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <details className="faq-item" key={item.question}>
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
      ))}
    </div>
  );
}
