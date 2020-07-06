import { useState, useRef, useEffect } from "react";

export const useExpander = <TContentElement extends HTMLElement>(defaultExpanded: boolean) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const expander = useControlledExpander<TContentElement>(expanded);

  return { ...expander, setExpanded: setExpanded };
};

export const useControlledExpander = <TContentElement extends HTMLElement>(expanded?: boolean) => {
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<TContentElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  return {
    expanded: expanded,
    contentProps: { ref: contentRef, style: { maxHeight: expanded ? contentHeight : 0 } },
  };
};
