import React from "react";
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
const DrawDialog = ({ drawerTrigger, drawerComp }: any) => {
  return (
    <div>
      <div className="h-full md:hidden">
        <Drawer>
          <DrawerTrigger className="">{drawerTrigger}</DrawerTrigger>
          <DrawerContent className="h-[55%] bg-black border-none">
            <DrawerTitle></DrawerTitle>
            <div className="">{drawerComp}</div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default DrawDialog;
