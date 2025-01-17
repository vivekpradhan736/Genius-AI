import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  Audio,
  Img,
} from 'remotion';

interface Caption {
  start: number;
  end: number;
  text: string;
}

interface RemotionVideoProps {
  script: string;
  imageList: string[];
  audioFileUrl: string;
  captions: Caption[];
  setDurationsInFrame: (duration: number) => void;
}

const RemotionVideo: React.FC<RemotionVideoProps> = ({
  script,
  imageList,
  audioFileUrl,
  captions,
  setDurationsInFrame,
}) => {
  const { fps } = useVideoConfig ();
  const frame = useCurrentFrame();

  const getDurationFrames = (): number => {
    const duration = (captions[captions.length - 1]?.end / 1000) * fps;
    setDurationsInFrame(duration);
    return duration;
  };

  const getCurrentCaptions = (): string => {
    const currentTime = (frame / fps) * 1000; // convert frame number to milliseconds
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption.text : '';
  };

  return script ? (
    <AbsoluteFill className="bg-black">
      {imageList.map((item, index) => {
        const startTime = (index * getDurationFrames()) / imageList.length;
        const duration = getDurationFrames();
        const scale = (index: number): number =>
          interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

        return (
          <Sequence
            key={index}
            from={Math.floor(startTime)}
            durationInFrames={Math.floor(duration)}
          >
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Img
                src={item}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${scale(index)})`,
                }}
              />
              <AbsoluteFill
                style={{
                  color: 'white',
                  justifyContent: 'center',
                  bottom: 50,
                  height: 150,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                <h2 className="text-2xl">{getCurrentCaptions()}</h2>
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  ) : null;
};

export default RemotionVideo;