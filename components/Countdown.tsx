"use client";

import { useEffect, useRef, useState } from "react";

const TARGET = new Date("2027-01-02T00:00:00+00:00").getTime();

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function diffToUnits(diff: number) {
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(totalSeconds / 86400)),
    hours: pad(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
  };
}

export default function Countdown() {
  const [units, setUnits] = useState<ReturnType<typeof diffToUnits> | null>(null);
  const [arrived, setArrived] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render() {
      const diff = TARGET - Date.now();

      if (diff <= 0) {
        setArrived(true);
        return;
      }

      setUnits(diffToUnits(diff));
    }

    render();
    const timer = setInterval(render, 1000);
    return () => clearInterval(timer);
  }, []);

  if (arrived) {
    return (
      <p className="countdown-arrived reveal">
        They&rsquo;re married! Welcome to forever, Jeremy &amp; Afriyie.
      </p>
    );
  }

  const display = units ?? { days: "00", hours: "00", minutes: "00", seconds: "00" };

  return (
    <div className="countdown-grid reveal" id="countdown-grid">
      {(["days", "hours", "minutes", "seconds"] as const).map((key) => (
        <div className="countdown-unit" key={key}>
          <span
            className={`countdown-number${reduceMotionRef.current ? "" : " tick"}`}
            key={units ? display[key] : "initial"}
          >
            {display[key]}
          </span>
          <span className="countdown-label">{key[0].toUpperCase() + key.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
