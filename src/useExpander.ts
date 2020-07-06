import { useState, useRef, useEffect } from "react";

// Thank you: https://css-tricks.com/using-css-transitions-auto-dimensions/

export const useExpander = <TContentElement extends HTMLElement>(
  defaultExpanded: boolean
) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const expander = useControlledExpander<TContentElement>(expanded);

  return {
    ...expander,
    expanded: expanded,
    setExpanded: setExpanded,
    toggleExpanded: () => setExpanded(!expanded),
  };
};

export const useControlledExpander = <TContentElement extends HTMLElement>(
  expanded?: boolean
) => {
  const contentRef = useRef<TContentElement>(null);
  const animationState = useRef<
    "expanded" | "expanding" | "collapsing" | "collapsed"
  >(expanded ? "expanded" : "collapsed");

  const [contentHeight, setContentHeight] = useState<number | string>(
    expanded ? "auto" : 0
  );

  const collapseContent = () => {
    if (
      (animationState.current === "expanded" ||
        animationState.current === "expanding") &&
      contentRef.current
    ) {
      animationState.current = "collapsing";

      const element = contentRef.current;
      const currentContentHeight = element.scrollHeight;

      requestAnimationFrame(() => {
        // Before animating back to height 0 we need to give it a "real height" value (we can't go from auto -> 0), we also need to give
        // the browser a chance to apply this change before doing the animation
        setContentHeight(currentContentHeight);

        requestAnimationFrame(() => {
          setContentHeight(0);
          animationState.current = "collapsed";
        });
      });
    } else {
      //console.log("Nothing to do (collapsing content)");
    }
  };

  const expandContent = () => {
    if (
      (animationState.current === "collapsed" ||
        animationState.current === "collapsing") &&
      contentRef.current
    ) {
      animationState.current = "expanding";
      const element = contentRef.current;
      const sectionHeight = element.scrollHeight;

      setContentHeight(sectionHeight);

      const handleTransitionEnd = () => {
        // Clean up after ourselves
        element.removeEventListener("transitionend", handleTransitionEnd);

        if (animationState.current === "expanding") {
          // The animation has finished lets set the height to auto
          setContentHeight("auto");
          animationState.current = "expanded";
        } else {
          // The animation state is no longer "expanding", this can happen if we try to collapse before the animation
          // has finished, in that case do nothing
        }
      };

      // TODO: Will this leak if the DOM element is unmounted before it has a chance to run? I guess it's ok in modern browsers but older ones?
      // This will run when the transition animation finished for the expanding
      element.addEventListener("transitionend", handleTransitionEnd);
    } else {
      //console.log("Nothing to do (expand content)");
    }
  };

  useEffect(() => {
    if (expanded) {
      expandContent();
    } else {
      collapseContent();
    }
  }, [expanded]);

  return {
    contentProps: {
      ref: contentRef,
      style: { overflow: "hidden", height: contentHeight },
    },
  };
};
