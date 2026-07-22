import {useCurrentFrame} from 'remotion';
import {createTimeline} from '../animations/timeline';
import type {TimelineEvent} from '../animations/timeline';

/**
 * useTimeline — creates a Timeline from event definitions and binds
 * it to the current frame.
 */
export function useTimeline(events: TimelineEvent[]) {
  const frame = useCurrentFrame();
  const tl = createTimeline(events);

  return {
    /** Is the named event currently active? */
    isActive: (name: string) => tl.isActive(name, frame),

    /** Frame elapsed since event start */
    localFrame: (name: string) => tl.localFrame(name, frame),

    /** Normalised progress [0, 1] of an event */
    progress: (name: string) => tl.progress(name, frame),

    /** Raw timeline instance for advanced use */
    timeline: tl,
    frame,
  };
}
