"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("cc3e5e83-f0b2-48dc-9ada-78d9fb1a192c")
    }, [])

    return null;
    
  return (
    <div>
      
    </div>
  )
}

export default CrispChat
