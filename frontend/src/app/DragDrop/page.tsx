'use client'
import { Family } from "@/classes/family";
import DraggableComponent from "@/components/draggableComponent"
import DragWrapper from "@/components/dragWrapper";
import DroppableComponent from "@/components/droppableComponent"
import {DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent} from "@dnd-kit/core"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Person } from "@/classes/person";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';

// TODO: fix the drag overlauy not knowing what the dragged person's name is.

export default function DragDrop() {

    const [families, setFamilies] = useState<Map<string, Family>>(new Map()
                                    .set("aaa-dddd-dddd", new Family("Matthews", "aaa-dddd-dddd"))
                                    .set("bbb-eeee-ffff", new Family("Woodsey", "bbb-eeee-ffff"))
                                    .set("ccc-gggg-hhhh", new Family("Johnson", "ccc-gggg-hhhh"))
                                    .set("ddd-iiii-jjjj", new Family("Davis", "ddd-iiii-jjjj"))
                                    .set("eee-jjjj-kkkk", new Family("Thompson", "eee-jjjj-kkkk"))
                                    .set("fff-llll-mmmm", new Family("Martinez", "fff-llll-mmmm"))
                                );
    const [stateChangeId, setStateChangeId] = useState<string>("");
    const [activePerson, setActivePerson] = useState<Person | null>();
    const [prevFamilyId, setPrevFamilyId] = useState<string | null>(null);

    const [alphabeticalMap, setAlphabeticalMap] = useState<Map<string, Map<string, Person>>>(new Map()); // <letterOfAlphabet, Map<personId, Person>>
    const [people, setPeople] = useState<Map<string, Person>>(new Map()); // <personId, person>
    const router = useRouter();

    const names = [
        // Matthews family
        "John Matthews", "Sarah Matthews", "Emma Matthews", "Michael Matthews",
      
        // Woodsey family
        "Tyler Woodsey", "Samantha Woodsey", "Daniel Woodsey", "Grace Woodsey",
      
        // Johnson family
        "Jessica Johnson", "Emily Johnson", "Matthew Johnson",
      
        // Davis family
        "Joshua Davis", "Olivia Davis", "Ryan Davis", "Benjamin Davis",
      
        // Thompson family
        "Christopher Thompson", "Sophia Thompson", "Andrew Thompson", "Isabella Thompson",
      
        // Martinez family
        "Laura Martinez", "James Martinez", "Ava Martinez", "Liam Martinez",
      
        // Harris family
        "David Harris", "Hannah Harris", "Elijah Harris", "Mia Harris",
      
        // Robinson family
        "William Robinson", "Charlotte Robinson", "Lucas Robinson", "Mason Robinson",
      
        // Clark family
        "Amelia Clark", "Scarlett Clark", "Logan Clark",
      
        // King family
        "Alexander King", "Victoria King", "Ella King", "Henry King",
      
        // Standalone names
        "Chloe Edwards", "Dylan Hughes", "Avery Henderson", "Zoe Campbell", "Abigail Foster",
        "Owen Griffin", "Jack Alexander", "Julian Richards", "Penelope Griffin",
        "Sebastian Richards", "Stella Jenkins", "Paisley Foster", "Anthony Brooks", "Nathan Reed",
        "Harper Walker", "Ellie Hayes", "Isaac Lopez", "Gabriel Long", "Leah Simmons",
        "Addison Powell", "Caleb Bennett", "Riley Myers", "Lillian Russell", "Jackson Bryant",
        "Aria Jenkins", "Victoria Butler", "James White", "William Perez",
        "David Lopez", "Natalie Price", "Nora Simmons",
        "Joseph Nelson", "Scarlett Howard", "Grace Scott", "Aiden Barnes"
      ];

    

    useEffect(() => { // TODO: DELETE FOR PROD
        let persons: Person[] = [];
        names.forEach((name) => {
            let id = uuidv4();
            let person = new Person(id, name);
            persons.push(person);
        })        
        const map = new Map();
        persons.forEach(person => {
            map.set(person.id, person);
        })
        setPeople(map);

    },[]);

    useEffect(() => {
        function findFirstLetter(name: string) {
            const nameParts = name.trim().split(/\s+/);
            const lastName = nameParts[nameParts.length - 1];
            return lastName ? lastName.charAt(0).toUpperCase() : '';
        }

        setAlphabeticalMap(prevAlphabeticalMap => {
            const newAlphabeticalMap = new Map(); // reinit cause u want to completley change based on people map
            people.forEach((person, id) => {
                const firstLetter = findFirstLetter(person.name);
                const oldLetterMap: Map<string, Person>  = newAlphabeticalMap.get(firstLetter) || new Map();
                oldLetterMap.set(id, person);
                newAlphabeticalMap.set(firstLetter, oldLetterMap);
            })

            return newAlphabeticalMap;
        })
    }, [people])

    useEffect(() => { // every time theres a change, add a new state change log to the list.
        setStateChangeId(uuidv4());
    }, [people, families]);

    function saveState(){
        const familiesArray = Array.from(families.entries()).map(([id, family]) => ({
            id: family.id,
            name: family.name,
            members: Array.from(family.members.entries()).map(([memberId, member]) => ({
                id: memberId,
                name: member.name
            }))
        }));

        localStorage.setItem('familyState', JSON.stringify(familiesArray));
        localStorage.setItem('personState', JSON.stringify(Array.from(people)));
    }

    // TODO: on page, load if theres local storage saved

    useEffect(() => {
        const interval = setInterval(() => {
                saveState();
        }, 5000);

        return (() => {
            clearInterval(interval);
        })
    }, [people, families])

    function handleDragEnd(event: DragEndEvent) {
        setActivePerson(null);
        const draggedPersonId = event.active.id.toString();
        let draggedPerson: Person;
        if (event.over !== null) { // handle to a family container, either from blank or from another family
            const droppedFamilyId = event.over.id.toString();
            if (prevFamilyId !== null){
                let prevFamily = families.get(prevFamilyId);
                // @ts-ignore
                draggedPerson = prevFamily?.members.get(draggedPersonId);
                deleteMemberFromFamily(prevFamilyId, draggedPersonId);
            } else {
                // @ts-ignore
                draggedPerson = people.get(draggedPersonId);
                deletePerson(draggedPersonId);
            }
            addMemberToFamily(droppedFamilyId, draggedPerson); 
        } else if (event.over === null && prevFamilyId !== null) { // handle back to blank, from a family
            let prevFamily = families.get(prevFamilyId);
            // @ts-ignore
            draggedPerson = prevFamily?.members.get(draggedPersonId);
            deleteMemberFromFamily(prevFamilyId, draggedPersonId);
            addPerson(draggedPerson);
        }
        setPrevFamilyId(null);
    }

    function handleDragStart(event: DragStartEvent) {
        // @ts-ignore
        setActivePerson(new Person(event.active.id.toString(), event.active.data.current.name));
        //display drag overlay
    }

    function handleDragOver(event: DragOverEvent) {
        // display the preview
        if (event.over && event.active){
            const currentFamily = families.get(event.over.id.toString());
            if (currentFamily?.members.has(event.active.id.toString())) { // if the moved thing is in the family, then add to prev
                setPrevFamilyId(event.over.id.toString());
            }
        }
    }

    function addFamily(){
        // get family name state from input 
        const familyName = "Duvvuri";

        setFamilies(prev => {
            const newMap = new Map(prev);
            const newFamily = new Family(familyName, uuidv4());
            newMap.set(newFamily.id, newFamily);
            return newMap;
        });
    }

    function addPerson(person: Person) {
        setPeople(prevNamesMap => {
            const newNamesMap = new Map(prevNamesMap);
            newNamesMap.set(person.id, person);
            return newNamesMap;
        })
    }

    function deletePerson(personId: string) {
        setPeople(prevNamesMap => {
            const newNamesMap = new Map(prevNamesMap);
            newNamesMap.delete(personId);
            return newNamesMap;
        })
    }

    function addMemberToFamily(familyId: string, member: Person){
        setFamilies(prev => {
            const newMap = new Map(prev);
            const updatedFamily = newMap.get(familyId);
            if (updatedFamily) {
                updatedFamily.addMember(member);
                newMap.set(familyId, updatedFamily);
            }
            return newMap;
        })
    }

    function deleteMemberFromFamily(familyId: string, memberId: string){
        setFamilies(prev => {
            const newMap = new Map(prev);
            const updatedFamily = newMap.get(familyId);
            if (updatedFamily) {
                updatedFamily.deleteMember(memberId);
                newMap.set(familyId, updatedFamily);
            }
            return newMap;
        })
    }

    return (
        <div className="w-full overflow-auto h-full">

        <DndContext onDragEnd={(event) => handleDragEnd(event)}
         onDragOver={(event) => handleDragOver(event)} 
         onDragStart={(event) => handleDragStart(event)}>
            <div className="flex flex-row w-full h-full gap-3 p-3">
                {/* left side div */}
                <div className="flex flex-col gap-2 w-1/3 h-full overflow-y-auto items-center">
                    <div className="flex flex-col gap-2">
                    {Array.from(families.entries())
                    .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // idk how this works, but it does work to sort by name
                    .map(([key, family]) => (
                        <DroppableComponent key={key} id={key} familyName={family.name}>
                            {Array.from(family.members.entries()).map(([memberId, member]) => (
                                <DraggableComponent key={memberId} name={member.name} id={memberId} inFamily={true}>
                                </DraggableComponent>
                            ))}
                        </DroppableComponent>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-0 flex-shrink overflow-y-auto h-full w-2/3">   
                        {Array.from(alphabeticalMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([letter, personMap]) => (
                            <div key={letter} className="flex flex-col">
                                <h3 className="text-[80px]">{letter}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(personMap).map(([id, person]) => (
                                        <DraggableComponent id={id} name={person.name} key={id} inFamily={false}>
                                        </DraggableComponent>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="flex flex-col items-center justify-center p-10">
                    <span>
                        Click to move on.
                    </span>
                    <button onClick={() => {
                        saveState();
                        router.push("/steptwo");
                    }}>
                        <ArrowRight size={100} />
                    </button>
                </div>
                <DragOverlay>
                        {activePerson ? (
                            <DragWrapper isActive name={activePerson.name} inFamily={false}>
                            </DragWrapper>
                        ): null}
                </DragOverlay>   
            </div>
        </DndContext>
        </div>
    )
}

