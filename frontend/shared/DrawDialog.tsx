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
const DrawDialog = ({ drawerTrigger, drawerComp, setIsOpenProp, }: {setIsOpenProp:React.Dispatch<React.SetStateAction<boolean>>,drawerComp:any,drawerTrigger:any}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsOpen((prev) => !prev);
    if (setIsOpenProp) {
      setIsOpenProp(!isOpen); // Set the parent state as well
    }
  };
  return (
    <div>
      <div className="h-full md:hidden">
        <Drawer  open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger onClick={handleDrawerOpen} className="">
            {drawerTrigger}
          </DrawerTrigger>
          <DrawerContent
             onClick={(e) => e.stopPropagation()}
            className="max-h-[55%] h-auto min-h-[40%] z-[10000] bg-black border-none text-white md:hidden"
          >
            <DrawerTitle></DrawerTitle>
            
            <div className="">
              {drawerComp}
            </div>
            <DrawerFooter className="">
              <DrawerClose
                className="rounded-full text-[18px] w-full border border-gray-500 py-2 "
                onClick={() => setIsOpenProp(false)}
              >
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
