'use client'

import { useEffect, useState, useRef} from "react";

import RelGraph from "@/components/relationships/relGraph";
import {Person} from "@/classes/people";
import {toast} from "sonner"
import { UserRoundPlus, UserRoundX, Users, Workflow, Undo2, Upload } from "lucide-react";
import { MenuButton } from "@/components/ui/menuButton";
import { ListItem } from "@/components/relationships/listItem";


export default function NewPlan(){
    const [people, setPeople] = useState<Map<number, Person>>(new Map());
    const [relationships, setRelationships] = useState<Map<number, Set<number>>>(new Map()); 
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentName, setCurrentName] = useState<string>("");
    const [selectedPeople, setSelectedPeople] = useState<Set<number>>(new Set);

    function handleInputEnter(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
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

    const addPerson = (name: string) => {
        const person = new Person(name, false);
        const newPeopleMap = new Map(people);
        const ind = newPeopleMap.size;
        newPeopleMap.set(ind, person);
        setPeople(newPeopleMap);

        const newRelationshipsMap = new Map(relationships);
        newRelationshipsMap.set(ind, new Set())
        setRelationships(newRelationshipsMap)
        toast.success('Added ' + name + ' to the seating plan.');
    }

    const onAddButtonClick = () => {
        setIsEditing(true);
    }

    const onRemovePerson = () => {
        if (selectedPeople.size === 0){
            toast.error("No people selected.")
            return
        }
        const deleteSize = selectedPeople.size;

        const updatedRelationshipsMap = new Map(relationships);
        const updatedPeopleMap = new Map(people);

        for (const index of selectedPeople){
            updatedPeopleMap.delete(index);
            updatedRelationshipsMap.delete(index);
            for (const [internalInd, relationshipSet] of updatedRelationshipsMap){
                if (relationshipSet.has(index)){
                    relationshipSet.delete(index);
                }
            }
        }

        setPeople(updatedPeopleMap);
        setRelationships(updatedRelationshipsMap);
        setSelectedPeople(new Set);
        toast.success("Deleted " + deleteSize + (deleteSize > 1 ? " people " : " person ") + " from list.")
    }

    const selectListItem = (index: number) => {
        const newSet = new Set(selectedPeople);
        if (newSet.has(index)){
            newSet.delete(index);
        }
        else {
            newSet.add(index);
        }
        setSelectedPeople(newSet)
    }

    const onAddEdgeButtonClick = () => {
        if (selectedPeople.size < 2){
            toast.error("Please select 2 or more people to connect.")
            return;
        }
        const numConnected = selectedPeople.size;
        const newRelationshipsMap = new Map(relationships);

        selectedPeople.forEach((selectedIndex) => {
            for (const [intInd, relationshipsSet] of newRelationshipsMap){
                if (intInd !== selectedIndex && selectedPeople.has(intInd)){
                    relationshipsSet.add(selectedIndex);
                }
            }
        })
        setRelationships(newRelationshipsMap)
        toast.success(`Connected ${numConnected} people.`)
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUploadCSV = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const names = text.split('\n').map(name => name.trim()).filter(name => name);
                
                const newPeopleMap = new Map(people);
                const newRelationshipsMap = new Map(relationships);

                names.forEach((fullName) => {
                    const person = new Person(fullName, false);
                    const ind = newPeopleMap.size;
                    newPeopleMap.set(ind, person);
                    newRelationshipsMap.set(ind, new Set());
                });

                setPeople(newPeopleMap);
                setRelationships(newRelationshipsMap);
                toast.success(`Added ${names.length} people to the chart.`);
            };
            reader.readAsText(file);
        } else {
            toast.error("Please upload a valid CSV file.");
        }
    }

    useEffect(() => {
        console.log('Relationships state has changed:', relationships);
    }, [relationships])

    return (
        <div id="main" className="flex flex-row items-stretch align-middle bg-[#212922] h-full w-full overflow-hidden"> 
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
                        <MenuButton tooltipText="Add new edge" onClick={onAddEdgeButtonClick}>
                            <Workflow color="#ffffff" />
                        </MenuButton>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Edit</div>
                    <div className="flex flex-row gap-6">
                        <MenuButton tooltipText="Delete people" onClick={() => {onRemovePerson()}}>
                            <UserRoundX color="#ffffff" />
                        </MenuButton>
                        <MenuButton tooltipText="Upload CSV" onClick={() => {onUploadCSV()}}>
                            <Upload color="#ffffff" />
                        </MenuButton>
                    </div>
                </div>
                {/* <NameList/> */}
                <div className="flex flex-col gap-3 p-3 pb-0 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">List of people</div>
                    <div className="flex flex-col gap-2 overflow-y-auto h-96"> 
                        {/* this one is the one w the list items */}
                        {Array.from(people.entries()).map(([index, person]) => {
                            return <ListItem selectListItem={() => {selectListItem(index)}} key={index} person={person}/>;
                        })}
                    </div>
                </div>
                <div className="text-white items-center align-center">
                    Created by <a href="https://andresduvvuri.com" className="font-bold">Andrés Duvvuri</a>
                </div>
            </div>
            <div className="w-full h-full flex flex-row justify-center items-center">
                {isEditing ? (
                    <div className="plan-content-div">
                        <input autoFocus className="text-white w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none" type="text" placeholder="start typing a name..." defaultValue={currentName} onKeyDown={handleInputEnter}/>
                        <div className="plan-header-item">
                            <p className="text-[#D7263D]">Press ⏎ to save this name.</p>
                            <p className="text-[#D7263D]">Press Esc to cancel.</p>
                        </div>
                    </div>
                ) : (
                    <RelGraph people={people} relationships={relationships}/>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    )
}