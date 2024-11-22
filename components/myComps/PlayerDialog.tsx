// import React, { useEffect, useState } from 'react';
// import { Player } from "@remotion/player";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import RemotionVideo from './RemotionVideo';
// import { useRouter } from 'next/navigation';
// import { eq } from 'drizzle-orm';
// import { VideoData, db } from '@/path/to/database';
// import { Button } from "@/components/ui/button";

// interface PlayerDialogProps {
//   playVideo: boolean;
//   videoId: string;
// }

// const PlayerDialog: React.FC<PlayerDialogProps> = ({ playVideo, videoId }) => {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [videoData, setVideoData] = useState<Record<string, any> | undefined>();
//   const [durationInFrame, setDurationInFrame] = useState<number>(100);
//   const router = useRouter();

//   useEffect(() => {
//     setOpenDialog(!openDialog);
//     if (videoId) {
//       GetVideoData();
//     }
//   }, [playVideo]);

//   const GetVideoData = async () => {
//     const result = await db
//       .select()
//       .from(VideoData)
//       .where(eq(VideoData.id, videoId));
//     console.log(result);
//     setVideoData(result[0] || {});
//   };

//   return (
//     <Dialog open={openDialog}>
//       <DialogContent className="bg-white flex flex-col items-center">
//         <DialogHeader>
//           <DialogTitle className="text-3xl font-bold my-5">
//             Your video is ready
//           </DialogTitle>
//           <DialogDescription>
//             <Player
//               component={RemotionVideo}
//               durationInFrames={Number(durationInFrame.toFixed(0))}
//               compositionWidth={300}
//               compositionHeight={480}
//               fps={30}
//               controls={true}
//               inputProps={{
//                 ...videoData,
//                 setDurationInFrame: (frameValue: number) => setDurationInFrame(frameValue),
//               }}
//             />
//             <div className='flex gap-10 mt-10'>
//               <Button
//                 variant='ghost'
//                 onClick={() => {
//                   router.replace('/dashboard');
//                   setOpenDialog(false);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button>Export</Button>
//             </div>
//           </DialogDescription>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PlayerDialog;