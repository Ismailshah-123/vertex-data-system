"use client";
import { useEffect, useRef, useState } from "react";

export default function useAnimatedCount(
  target: number,
  trigger: boolean,
  duration = 2400,
  isFloat = false
) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;
    let startTime = 0;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const prog = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 4);
      setValue(target * ease);
      if (prog < 1) requestAnimationFrame(step);
      else setValue(target);
    }
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return isFloat ? value.toFixed(1) : Math.round(value).toString();
}
