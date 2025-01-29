import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PortalContainerWrapper from "./PortalContainerWrapper";
const DrawDialog = ({ drawerTrigger, drawerComp }: any) => {
  const[isOpen,setIsOpen]=useState(false);
  return (
    <div>
      <div className="h-full md:hidden">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger onClick={()=>setIsOpen(prev=>!prev)} className="">{drawerTrigger}</DrawerTrigger>
          <DrawerContent onClick={()=>setIsOpen(false)} className="max-h-[55%] h-auto min-h-[30%] bg-black border-none text-white">
            <DrawerTitle></DrawerTitle>
            <div className="">
              {drawerComp}
             {/* //</PortalContainerWrapper> {drawerComp} */}
             
              </div>
              <DrawerFooter>
              <DrawerClose className="rounded-full text-[18px] w-full border border-gray-500 py-2 " onClick={() => setIsOpen(false)}>
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default DrawDialog;
