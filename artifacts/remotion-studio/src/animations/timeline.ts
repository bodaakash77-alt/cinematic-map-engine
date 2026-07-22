import {clamp} from '../utils/math';

export interface TimelineEvent {
  name: string;
  from: number;
  duration: number;
  layer?: number;
}

// ─── Timeline class ───────────────────────────────────────────────────────────
export class Timeline {
  private events: Map<string, TimelineEvent> = new Map();

  add(event: TimelineEvent): this {
    this.events.set(event.name, event);
    return this;
  }

  get(name: string): TimelineEvent | undefined {
    return this.events.get(name);
  }

  /** Is the named event active at the given frame? */
  isActive(name: string, frame: number): boolean {
    const ev = this.events.get(name);
    if (!ev) return false;
    return frame >= ev.from && frame < ev.from + ev.duration;
  }

  /** Frame relative to event start */
  localFrame(name: string, frame: number): number {
    const ev = this.events.get(name);
    if (!ev) return 0;
    return Math.max(0, frame - ev.from);
  }

  /** Normalised progress [0, 1] */
  progress(name: string, frame: number): number {
    const ev = this.events.get(name);
    if (!ev) return 0;
    return clamp((frame - ev.from) / ev.duration, 0, 1);
  }

  /** Latest end frame of all events */
  get totalDuration(): number {
    let max = 0;
    this.events.forEach((ev) => {
      max = Math.max(max, ev.from + ev.duration);
    });
    return max;
  }

  toArray(): TimelineEvent[] {
    return [...this.events.values()].sort((a, b) => a.from - b.from);
  }
}

// ─── Factory helpers ──────────────────────────────────────────────────────────
export function createTimeline(events: TimelineEvent[]): Timeline {
  const tl = new Timeline();
  events.forEach((ev) => tl.add(ev));
  return tl;
}

/** Lay events end-to-end starting at startFrame */
export function sequenceEvents(
  events: Omit<TimelineEvent, 'from'>[],
  startFrame = 0,
): TimelineEvent[] {
  let cursor = startFrame;
  return events.map((ev) => {
    const full = {...ev, from: cursor};
    cursor += ev.duration;
    return full;
  });
}

/** Stagger overlapping events */
export function staggerEvents(
  events: Omit<TimelineEvent, 'from'>[],
  staggerFrames: number,
  startFrame = 0,
): TimelineEvent[] {
  return events.map((ev, i) => ({
    ...ev,
    from: startFrame + i * staggerFrames,
  }));
}
