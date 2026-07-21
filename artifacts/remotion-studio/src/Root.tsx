import React from 'react';
import {Composition} from 'remotion';
import {MyComposition, myCompSchema} from './Composition';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: 'Welcome to Remotion',
          titleColor: '#000000',
          logoColor: '#00bfff',
        }}
      />
    </>
  );
};
