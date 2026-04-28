import React from "react";

function ScrollSection({ eyebrow, title, body, align = "left", delay = 0, id }) {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-section scroll-section--${align} ${
        isVisible ? "is-visible" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <article className="scroll-card">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </article>
    </section>
  );
}

export default ScrollSection;