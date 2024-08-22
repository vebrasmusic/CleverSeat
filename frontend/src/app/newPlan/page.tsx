'use client'

import { useState} from "react";

import { ListItem } from "@/components/relationships/listItem";
import RelGraph from "@/components/relationships/relGraph";
import { AGraph, Person, Relationship, RelationshipGraph } from "@/classes/people";
import {PeopleContext} from "@/context/peopleContext"
import {toast} from "sonner"
import { UserRoundPlus, UserRoundX, Users, Workflow, Undo2 } from "lucide-react";
import { MenuButton } from "@/components/ui/menuButton";



export default function NewPlan(){
    // left side => menu
    // right side => graph

    //modal
    

    const [people, setPeople] = useState<Person[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentName, setCurrentName] = useState<string>("");

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        const name = event.currentTarget.value;

        setCurrentName(name); // Update state

        if (event.key === "Enter") {
            if (name != '') {
                addPerson(name); // this spreads the state and adds to it
                setCurrentName('');
                event.currentTarget.value = ''; // Clear the input field
                setIsEditing(false);
            }
            else {
                toast.error("Please type in a name.")
            }
        }
        else if (event.key === "Escape") {
            setIsEditing(false)
        }
    }

    const onAddFamily = () => {
        // add parent node to graph
    }

    const addPerson = (name: string) => {
        const person = new Person(name, false);
        setPeople(prevPeople => [...prevPeople, person]);
        toast.success('Added ' + name + ' to the seating plan.');
    }

    const onAddButtonClick = () => {
        setIsEditing(true);
    }

    const onRemovePerson = () => {
        
    }



    return (
        <div id="main" className="flex flex-row items-stretch align-middle bg-[#212922] h-full w-full overflow-hidden"> 
        <PeopleContext.Provider value={people}>
            <div id="menu" className="flex flex-col items-center align-middle p-6 border-r-[0.5px] w-[300px] gap-7">
                <div className="text-white text-[25px]">
                    Graph Tools
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Create</div>
                    <div className="flex flex-row gap-6">
                        <MenuButton tooltipText="Add new person" onClick={onAddButtonClick}>
                            <UserRoundPlus color="#ffffff"/>
                        </MenuButton>
                        <MenuButton tooltipText="Add new family">
                            <Users color="#ffffff" />
                        </MenuButton>
                        <MenuButton tooltipText="Add new edge">
                            <Workflow color="#ffffff" />
                        </MenuButton>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Edit</div>
                    <div className="flex flex-row gap-6">
                        <MenuButton tooltipText="Remove person" onClick={() => {onRemovePerson()}}>
                            <UserRoundX color="#ffffff" />
                        </MenuButton>
                        <MenuButton tooltipText="Undo">
                            <Undo2 color="#ffffff" />
                        </MenuButton>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">List of people</div>
                    <div className="flex flex-col gap-2 overflow-y-auto h-96"> 
                        {/* this one is the one w the list items */}
                        {people.map((person, key) => {
                            return <ListItem key={key} person={person}/>;
                        })}
                    </div>
                </div>
                <div className="text-white items-center align-center">
                    Created by <a href="https://andresduvvuri.com">Andrés Duvvuri</a>
                </div>
            </div>
            <div className="w-full h-full">
                {isEditing ? (
                    <div className="plan-content-div">
                    <input autoFocus className="text-white w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none" type="text" placeholder="start typing a name..." defaultValue={currentName} onKeyDown={handleKeyPress} />
                    <div className="plan-header-item">
                        <p className="text-[#D7263D]">Press ⏎ to save this name.</p>
                        <p className="text-[#D7263D]">Press Esc to cancel.</p>
                    </div>
                </div>
                ) : (
                    <RelGraph/>
                )}
            </div>
        </PeopleContext.Provider>
        </div>
    )
}