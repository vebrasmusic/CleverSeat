'use client'

import { Person } from "@/classes/people"
import { Button } from "../ui/button"
import { useState, useContext, useEffect } from "react";
import {PeopleContext} from "@/context/peopleContext"
import { Trash2Icon } from "lucide-react";

  


interface ListItemInterface{
    person: Person

}

const onDeleteClick = () => {
    // delete this from the main state.


    /**
     * 
     * 
     * 
     * send up the chain message to delete from list
     */
}

export const ListItem = ({person, selectListItem}: {person: Person, selectListItem: () => void}) => {

    const [isSelected, setIsSelected] = useState(false);

    return (
        <div className="flex flex-row items-center gap-3">
            <div className={`w-full hover:bg-gray-600 rounded-[4px] gap-5 p-2 text-white text-lg cursor-pointer mr-3 ${isSelected ? "bg-gray-300 text-black" : "bg-transparent"}`}
             onClick={() => {
                setIsSelected(!isSelected);
                selectListItem();
             }}>
                {person.name}
            </div>
        </div>
    )
}