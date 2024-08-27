'use client'
import React from "react";
import { ListItem } from "@/components/relationships/listItem";
import { Person } from "@/classes/people";


export default function NameList({people, selectListItem}: {people: Map<number, Person>, selectListItem: () => void}){

    const [selectedPeople, setSelectedPeople] = useState<Set<number>>(new Set);

    return (
        
    )
}