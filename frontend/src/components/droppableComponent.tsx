'use client'
import React, { CSSProperties, ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"

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
                <div className={`${isOver ? 'bg-[#517664] text-black border-[#517664]' : 'bg-[#212529] text-white border-[#212529]'} border-4 flex justify-start items-center h-24 rounded-t-lg p-2`}>
                <span className="text-[2.986rem]">
                    {familyName}
                </span>
                </div>
            )}
            <div ref={setNodeRef} className='flex flex-col overflow-x-hidden overflow-y-auto border-x-4 border-b-4 border-[#212529] rounded-b-lg'>
                <div className="collapsed-border-container z-50">
                    {children}
                </div>
                <div className="absolute z-0" style = {{
                    backgroundColor: '#fff',
                    opacity: 0.2,
                    backgroundSize: '5px 5px',
                    backgroundImage: 'repeating-linear-gradient(45deg, #212529 0, #212529 0.5px, #fff 0, #fff 50%)'
                }}> 
                </div>
            </div>
        </div>
    )
}