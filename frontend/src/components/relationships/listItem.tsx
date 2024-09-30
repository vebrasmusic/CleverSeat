'use client'

import { Person, Family } from "@/classes/people"
import { useState } from "react";


export const ListItem = ({node, selectListItem}: {node: Person | Family, selectListItem: () => void}) => {

    const [isSelected, setIsSelected] = useState(false);

    if (node instanceof Family){
        
    }

    return (
        <div className="flex flex-row items-center gap-3">
            <div className={`w-full hover:bg-gray-600 rounded-[4px] gap-5 p-2 text-white text-lg cursor-pointer mr-3 ${isSelected ? "bg-gray-300 text-black" : "bg-transparent"}`}
             onClick={() => {
                setIsSelected(!isSelected);
                selectListItem();
             }}>
                {node.name}
            </div>
        </div>
    )
}