import React from 'react'
import { Composition } from 'remotion';
import { RemotionVideoProps } from '@/types'; // Adjust path as needed
import RemotionVideo from '@/components/myComps/RemotionVideo';

function RemotionRoot() {
  // Mock data for required props
  const remotionProps: RemotionVideoProps = {
    script: 'Sample Script',
    imageList: ['image1.jpg', 'image2.jpg'],
    audioFileUrl: 'audio.mp3',
    captions: [{ start: 0, end: 1000, text: 'Sample Caption' }],
    setDurationsInFrame: (frameValue: number) => console.log(`Frame set: ${frameValue}`)
  };

  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        defaultProps={remotionProps} // Passing the required props here
      />
    </>
  );
}

export default RemotionRoot;