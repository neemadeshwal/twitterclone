import React from "react";
import ReactDOM from "react-dom";

const PortalContainerWrapper = ({
  isDialogTriggered,
  element,
  triggerComp,
}: any) => {
  return (
    <div>
      <div className="">
        <div>
          {triggerComp}
          {isDialogTriggered && ReactDOM.createPortal(element, document.body)}
        </div>
      </div>
    </div>
  );
};

export default PortalContainerWrapper;
