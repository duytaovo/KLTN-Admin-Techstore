import {
  useState,
  useRef,
  useId,
  type ElementType,
  useContext,
  useEffect,
} from "react";
import {
  useFloating,
  FloatingPortal,
  shift,
  offset,
  type Placement,
  useClick,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  children: React.ReactNode;
  renderPopover: React.ReactNode;
  className?: string;
  as?: ElementType;
  initialOpen?: boolean;
  placement?: Placement;
  handePopup: any;
  isOpenPopup: boolean;
  setIsOpenPopup: any;
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = "div",
  initialOpen,
  isOpenPopup,
  setIsOpenPopup,
  placement = "bottom",
  handePopup,
}: Props) {
  const arrowRef: any = useRef<HTMLElement>(null);
  const { x, y, reference, floating, context, strategy } = useFloating({
    middleware: [offset(0)],
    placement: placement,
  });
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);
  const id = useId();
  const showPopover = () => {
    setIsOpenPopup(true);
  };
  const hidePopover = () => {
    setIsOpenPopup(false);
  };

  return (
    <Element
      className={className}
      ref={reference}
      onFocus={showPopover}
      onBlur={hidePopover}
      // {...getReferenceProps()}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {isOpenPopup && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? "center",
                left: x ?? "center",
                width: "max-content",
                zIndex: 10000000,
              }}
              initial={{ opacity: 0, transform: "scale(0)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0)" }}
              transition={{ duration: 0.2 }}
              {...getFloatingProps()}
            >
              {/* Arrow pointing upwards */}
              <div
                ref={arrowRef}
                className="absolute z-[10000] border-t-4 border-solid border-white"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  );
}
