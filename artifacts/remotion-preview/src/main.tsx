import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {CinematicDocumentary} from '../../remotion-studio/src/compositions/CinematicDocumentary';

const root = createRoot(document.getElementById('root')!);

root.render(
  <div style={{
    minHeight:'100vh',
    background:'#07090c',
    padding:'24px',
    boxSizing:'border-box',
    fontFamily:'Arial, sans-serif',
  }}>
    <div style={{maxWidth:1400,margin:'0 auto'}}>
      <div style={{color:'#d7b56d',fontSize:12,letterSpacing:4,fontWeight:700,marginBottom:10}}>
        REMOTION • CINEMATIC DOCUMENTARY
      </div>
      <div style={{color:'#e7e0d2',fontSize:28,fontWeight:700,marginBottom:18}}>
        Professional Motion Graphics Preview
      </div>
      <Player
        component={CinematicDocumentary}
        durationInFrames={450}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        controls
        autoPlay
        loop
        style={{width:'100%',borderRadius:12,overflow:'hidden'}}
      />
      <div style={{color:'#7f8a91',fontSize:12,marginTop:12}}>
        1920×1080 • 30fps • 15 seconds • Browser preview
      </div>
    </div>
  </div>,
);