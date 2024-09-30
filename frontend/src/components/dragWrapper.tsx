import React, { ReactNode } from "react";

import { useDraggable } from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react";

interface DragWrapperProps extends React.ComponentPropsWithRef<'div'> {
    name: string;
    isActive: boolean;
    inFamily: boolean;
    children?: ReactNode;
}

export default function DragWrapper({name, isActive, children, inFamily, ...props}: DragWrapperProps) {
    
    return (
        <div {...props} className={`${isActive ? 'border-black bg-[#517664] text-white' : 'border-[#212529] bg-white text-[#212529]'} ${inFamily ? 'border-0' : 'border-4 shadow-md'} hover:border-[#517664] hover:text-white flex flex-row justify-between p-2 items-center align-middle h-20 w-[200px] rounded-lg`}>
            <div>
                {name}
            </div>
            {children}
            <GripVertical />
        </div>
    )
}