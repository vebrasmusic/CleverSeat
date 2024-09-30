import React, { ReactNode } from "react";

import { useDraggable } from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities"
import DragWrapper from "./dragWrapper";

interface DraggableProps {
    id: string;
    name: string;
    inFamily: boolean;
    children?: ReactNode;
}

export default function DraggableComponent({id, name, children, inFamily}:DraggableProps) {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: id
    })

    return (
        <div ref={setNodeRef} className="touch-none cursor-move h-fit w-fit">
            <DragWrapper {...listeners} {...attributes} name={name} isActive={false} inFamily={inFamily}>
                {children}
            </DragWrapper>
        </div>
    )
}