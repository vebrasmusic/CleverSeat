'use client'

import { useEffect, useState, useRef} from "react";

import RelGraph from "@/components/relationships/relGraph";
import { Person, Family } from "@/classes/people";
import { toast } from "sonner"
import { UserRoundPlus, UserRoundX, Users, Workflow, Upload, UserRoundSearch } from "lucide-react";
import { MenuButton } from "@/components/ui/menuButton";
import { ListItem } from "@/components/relationships/listItem";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";


export default function NewPlan(){
    const [people, setPeople] = useState<Map<number, Person | Family>>(new Map()); // map [index: Person]
    const [indexCounter, setIndexCounter] = useState(0);
    const [relationships, setRelationships] = useState<Map<number, Map<number, number>>>(new Map()); // Map [sourceIndex: [[targetindex, weight]]]
    const [isEditingName, setisEditingName] = useState<boolean>(false);
    const [isEditingFamilyName, setIsEditingFamilyName] = useState<boolean>(false);
    const [familyName, setFamilyName] = useState<string>("");
    const [currentName, setCurrentName] = useState<string>("");
    const [selectedPeople, setSelectedPeople] = useState<Set<number>>(new Set);
    const [isEditingEdgeWeight, setIsEditingEdgeWeight] = useState<boolean>(false);
    const [currentEdgeWeight, setCurrentEdgeWeight] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const weights = [1,0.8,0.7,0.3];

    const handleOnSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
    };

    const filteredPeople = Array.from(people.entries()).filter(([index, person]) => {
        return searchTerm === "" || person.name.toLowerCase().includes(searchTerm);
    });

    function handleInputEnter(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        const name = event.currentTarget.value;

        setCurrentName(name); // Update state

        if (event.key === "Enter") {
            if (name != '') {
                addPerson(name); // this spreads the state and adds to it
                setCurrentName('');
                event.currentTarget.value = ''; // Clear the input field
                setisEditingName(false);
            }
            else {
                toast.error("Please type in a name.");
            }
        }
        else if (event.key === "Escape") {
            setisEditingName(false)
        }
    }

    function handleFamilyInputEnter(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        const name = event.currentTarget.value;

        setFamilyName(name); // Update state

        if (event.key === "Enter") {
            if (name != '') {
                addFamily(name); // this spreads the state and adds to it
                setFamilyName('');
                event.currentTarget.value = ''; // Clear the input field
                setIsEditingFamilyName(false);
            }
            else {
                toast.error("Please type in a family name.");
            }
        }
        else if (event.key === "Escape") {
            setIsEditingFamilyName(false)
        }
    }

    function addFamily(name:string){
        const family = new Family(`The ${name} Family`);
        const newPeopleMap = new Map(people);
        const ind = indexCounter;
        setIndexCounter(indexCounter + 1);
        newPeopleMap.set(ind, family);
        setPeople(newPeopleMap);

        const newRelationshipsMap = new Map(relationships);
        newRelationshipsMap.set(ind, new Map());
        setRelationships(newRelationshipsMap);
        toast.success('Added ' + name + ' to the seating plan.');
    }

    function handleSelectEnter(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        if (event.key === "Enter") {
            if (currentEdgeWeight) {
                addEdge(currentEdgeWeight)// this spreads the state and adds to it
                setCurrentEdgeWeight(0.2);
                setIsEditingEdgeWeight(false)
            }
            else { 
                toast.error("Please select a relationship type.");
            }
        }
        else if (event.key === "Escape") {
            setIsEditingEdgeWeight(false);
        }
    }

    const addPerson = (name: string) => {
        const person = new Person(name, false);
        const newPeopleMap = new Map(people);
        const ind = indexCounter;
        setIndexCounter(indexCounter + 1);
        newPeopleMap.set(ind, person);
        setPeople(newPeopleMap);

        const newRelationshipsMap = new Map(relationships);
        newRelationshipsMap.set(ind, new Map())
        setRelationships(newRelationshipsMap)
        toast.success('Added ' + name + ' to the seating plan.');
    }

    const onAddButtonClick = () => {
        setisEditingName(true);
    }

    const onAddFamilyButtonClick = () => {
        setIsEditingFamilyName(true);
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
        setIsEditingEdgeWeight(true);
    }

    const addEdge = (edgeWeight: number) => {
        const numConnected = selectedPeople.size;
        const newRelationshipsMap = new Map(relationships);

        selectedPeople.forEach((selectedIndex) => {
            for (const [intInd, relationshipsMap] of newRelationshipsMap){
                if (intInd !== selectedIndex && selectedPeople.has(intInd)){
                    relationshipsMap.set(selectedIndex, edgeWeight);
                }
            }
        })
        setRelationships(newRelationshipsMap);
        setIsEditingEdgeWeight(false);
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
                let currentIndex = indexCounter;

                names.forEach((fullName) => {
                    const person = new Person(fullName, false);
                    newPeopleMap.set(currentIndex, person);
                    newRelationshipsMap.set(currentIndex, new Map());
                    currentIndex++;
                });

                setPeople(newPeopleMap);
                setRelationships(newRelationshipsMap);
                setIndexCounter(currentIndex);
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
            <div id="menu" className="flex flex-col items-center align-middle p-6 border-r-[0.5px] gap-7 w-[400px]">
                <div className="text-white text-[25px]">
                    Graph Tools
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Create</div>
                    <div className="flex flex-row gap-6">
                        <MenuButton tooltipText="Add new person" onClick={onAddButtonClick}>
                            <UserRoundPlus color="#ffffff"/>
                        </MenuButton>
                        <MenuButton tooltipText="Add new family" onClick={onAddFamilyButtonClick}>
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
                    <div className="flex flex-row gap-1 align-middle items-center">
                        <UserRoundSearch color="white"/>
                        <Input className="text-white border-0" placeholder="Search for a name..." onChange={handleOnSearchChange} type="search"></Input>
                    </div>
                    <div className="flex flex-col gap-2 pb-2 overflow-y-auto h-96"> 
                        {/* this one is the one w the list items */}
                        {filteredPeople.map(([index, node]) => {
                            return <ListItem selectListItem={() => {selectListItem(index)}} key={index} node={node}/>;
                        })}
                    </div>
                </div>
                <div className="text-white items-center align-center">
                    Created by <a href="https://andresduvvuri.com" className="font-bold">Andrés Duvvuri</a>
                </div>
            </div>
            <div className="w-full h-full flex flex-row justify-center items-center">
            {(() => {
                    if (isEditingName) {
                        return (
                            <div className="plan-content-div">
                                <input autoFocus className="text-white w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none" type="text" placeholder="start typing a name..." defaultValue={currentName} onKeyDown={handleInputEnter}/>
                                <div className="plan-header-item">
                                    <p className="text-[#D7263D]">Press Enter to save this name.</p>
                                    <p className="text-[#D7263D]">Press Esc to cancel.</p>
                                </div>
                            </div>
                        );
                    } 
                    else if (isEditingFamilyName){
                            return (
                                <div className="plan-content-div">
                                    <input autoFocus className="text-white w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none" type="text" placeholder="start typing a name..." defaultValue={currentName} onKeyDown={handleFamilyInputEnter}/>
                                    <div className="plan-header-item">
                                        <p className="text-[#D7263D]">Press Enter to save this family.</p>
                                        <p className="text-[#D7263D]">Press Esc to cancel.</p>
                                    </div>
                                </div>
                            );
                    }
                    else if (isEditingEdgeWeight) {
                        return (
                            <form className="plan-content-div">
                                <Select onValueChange={(value) => {setCurrentEdgeWeight(Number(value))}}>
                                    <SelectTrigger autoFocus className=" text-white w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none " onKeyDown={handleSelectEnter}>
                                        <SelectValue placeholder="Relationship Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={weights[0].toString()}>Immediate Family</SelectItem>
                                        <SelectItem value={weights[1].toString()}>Family / Related</SelectItem>
                                        <SelectItem value={weights[2].toString()}>Friend</SelectItem>
                                        <SelectItem value={weights[3].toString()}>Acquaintance</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="plan-header-item">
                                    <p className="text-[#D7263D]">Press Enter to save this relationship.</p>
                                    <p className="text-[#D7263D]">Press Esc to cancel.</p>
                                </div>
                            </form>
                        );
                    } else {
                        return <RelGraph people={people} relationships={relationships} weights={weights}/>;
                    }
                })()}
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