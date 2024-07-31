import React, { useEffect, useRef } from 'react';

interface StopEventPropagationProps {
  eventType: string;
  children: React.ReactNode;
}

const StopEventPropagation: React.FC<StopEventPropagationProps> = ({ eventType, children }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      e.stopPropagation();
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener(eventType, handleEvent);
    }

    return () => {
      if (element) {
        element.removeEventListener(eventType, handleEvent);
      }
    };
  }, [eventType]);

  return <div ref={elementRef}>{children}</div>;
};

export default StopEventPropagation;
