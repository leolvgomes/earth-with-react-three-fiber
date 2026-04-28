import React from "react";

function getScrollProgress() {
  if (typeof window === "undefined") {
    return 0;
  }

  const scrollTop = window.scrollY || window.pageYOffset || 0;
  const docHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const maxScroll = Math.max(docHeight - viewportHeight, 1);

  return Math.min(scrollTop / maxScroll, 1);
}

function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    let frameId = 0;
    let targetProgress = getScrollProgress();
    let currentProgress = targetProgress;

    const updateScrollProgress = () => {
      targetProgress = getScrollProgress();

      if (frameId === 0) {
        animateScrollProgress();
      }
    };

    const animateScrollProgress = () => {
      frameId = window.requestAnimationFrame(() => {
        currentProgress = currentProgress + (targetProgress - currentProgress) * 0.08;
        setScrollProgress(currentProgress);

        if (Math.abs(targetProgress - currentProgress) > 0.0005) {
          animateScrollProgress();
        } else {
          currentProgress = targetProgress;
          setScrollProgress(targetProgress);
          frameId = 0;
        }
      });
    };

    const onScroll = () => {
      updateScrollProgress();
    };

    updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return scrollProgress;
}

export default useScrollProgress;