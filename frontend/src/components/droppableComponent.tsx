'use client'
import React, { CSSProperties, ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { CirclePlus } from "lucide-react";

interface DroppableComponentProps {
    id: string;
    familyName: string;
    children?: ReactNode;
}

export default function DroppableComponent({id, children, familyName}: DroppableComponentProps){
    const {isOver, setNodeRef, active, over} = useDroppable({
        id: id
    });


    return (
        <div className="flex flex-col w-[500px]">
            {familyName !== "" && (
                <div className={`${isOver ? 'bg-[#517664] text-black border-[#517664]' : 'bg-[#212529] text-white border-[#212529]'} border-4 flex justify-start items-center h-24 rounded-t-lg p-4`}>
                <span className="text-[2.986rem]">
                    {familyName}
                </span>
                </div>
            )}
            <div ref={setNodeRef} className='flex flex-col overflow-x-hidden overflow-y-auto border-x-4 border-b-4 border-[#212529] rounded-b-lg'>
                <div className="collapsed-border-container z-50">
                    {children}
                </div>
            </div>
            {/* the lil plus drag button here */}
            <div className="flex flex-col items-center ">
                <CirclePlus size={active !== null ? 60 : 40} className={`z-50 mt-2 ${active !== null ? '' : ''}`} />
            </div>
        </div>
    )
}