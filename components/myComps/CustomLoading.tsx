import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

interface CustomLoadingProps {
  loading: boolean;
}

const CustomLoading: React.FC<CustomLoadingProps> = ({ loading }) => {
  return (
    <div>
      <AlertDialog open={loading}>
        <AlertDialogContent className="bg-white">
          <div className="bg-white flex flex-col items-center my-10 justify-center">
            <Image src={"/load-time.gif"} width={100} height={100} alt="Loading" />
            <h2>Generating your video.... Do not Refresh</h2>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CustomLoading;