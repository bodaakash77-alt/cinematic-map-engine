# assets/

Place static assets (images, fonts, audio, video) here that are imported
directly into compositions via `staticFile()` or standard `import`.

## Usage in Remotion

```ts
import {staticFile} from 'remotion';

// Reference a file in /public
const src = staticFile('my-video.mp4');

// Or import directly (images only)
import logo from '../assets/logo.png';
```

## Recommended sub-folders

```
assets/
  images/      ← still images used as layers
  video/       ← video clips
  audio/       ← music, SFX, voice-over
  fonts/       ← custom typefaces
  maps/        ← GeoJSON or SVG map data
```

Remotion bundles everything in `/public` automatically.
Large binary files (video, audio) should live in `/public`, not here,
to avoid inflating the JS bundle.
