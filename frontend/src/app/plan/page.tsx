'use client'

import { useRef } from 'react';
import gsap from 'gsap'; // <-- import GSAP
import { useGSAP } from '@gsap/react'; // <-- import the hook from our React package
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { PeopleContext } from "@/context/peopleContext";

import { Person, Relationship, RelationshipGraph } from "@/classes/people";
import { RelationshipsContext } from "@/context/relationshipsContext";
import { RelationshipDropdown } from "@/components/relationships/relationship_dropdown";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TypeDropdown } from '@/components/relationships/typeDropdown';
import RelGraph from '@/components/relationships/relGraph';

  
export default function Plan() {

    const animationContainer = useRef<HTMLDivElement>(null);
    const [currentName, setCurrentName] = useState(''); // this is just for the name not going away when they tab
    const [relationshipGraph, setRelationshipGraph] = useState<RelationshipGraph>(new RelationshipGraph());
    const [people, setPeople] = useState<Person[]>([]); //array of person objects
    const [isEditing, setIsEditing] = useState(false);
    const [editedIndex, setEditedIndex] = useState(0);

    useEffect(() => {
        const handleGlobalKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Tab") {
                event.preventDefault(); // Prevent the default tab behavior
                setIsEditing(!isEditing);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyPress);

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyPress);
        };
    }, [isEditing]); // this use effect is for doing the tab to switch to edit mode

    const { contextSafe } = useGSAP({ scope: animationContainer });
     // we can pass in a config object as the 1st parameter to make scoping simple
    useGSAP(
    () => {
        gsap.to('.plan-div', {
        opacity: 1,
        duration: 1,
        });
    },
    {
        scope: animationContainer,
    }
    )

    const addPerson = (name: string) => {
        const person = new Person(name, false);
        setPeople(prevPeople => [...prevPeople, person]);
    }

    const removePerson = (index: number) => {
        setPeople(prevPeople => prevPeople.filter((person, i) => i !== index));
    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        const name = event.currentTarget.value;

        setCurrentName(name); // Update state


        if (event.key === "Enter") {
            if (name != '') {
                addPerson(name); // this spreads the state and adds to it
                toast.success('Added ' + name + ' to the seating plan.');
                setCurrentName('');
                event.currentTarget.value = ''; // Clear the input field
            }
        }
    }

    const handleDialogSave = () => {
        if (currentName === '') {
            return;
        }
        addPerson(currentName);
        removePerson(editedIndex);
        toast.success('Saved person.');
    }

  return (
    <div className="content-div" ref={animationContainer}>
        <PeopleContext.Provider value={people}>
        <RelationshipsContext.Provider value={relationshipGraph}>
        <div className="plan-div">
            {/* <div className="plan-header">
                <div className="plan-header-item">
                    <p>{`< Start over`}</p>
                </div>
            </div> */}
            {!isEditing ? (
                <div className="plan-content-div">
                    <input autoFocus className="w-full h-full text-center text-[50px] md:text-[80px] xl:text-[127.88px] bg-transparent border-none outline-none" type="text" placeholder="start typing a name..." defaultValue={currentName} onKeyDown={handleKeyPress} />
                    <div className="plan-header-item">
                        <p className="text-[#D7263D]">Press ⏎ to save this name.</p>
                        <p className="text-[#D7263D]">Press Tab to see / edit your list of names.</p>
                    </div>
                </div>
            ) : (
                    <RelGraph/>
                    // <ScrollArea className="plan-content-div">
                    //     <Table className="plan-data-table">
                    //         <TableCaption>Click each name to add relationships.</TableCaption>
                    //         <TableHeader>
                    //             <TableRow>
                    //                 <TableHead>Name</TableHead>
                    //                 <TableHead>Status</TableHead>
                    //             </TableRow>
                    //         </TableHeader>
                    //         <TableBody>
                    //             {people.map((person, index) => (
                    //                 <TableRow key={person.name}>
                    //                     <TableCell className="font-medium pr-40">
                    //                         <Dialog>
                    //                             <DialogTrigger>{person.name}</DialogTrigger>
                    //                             <DialogContent>
                    //                                 <DialogHeader>
                    //                                     <DialogTitle>
                    //                                         <Input 
                    //                                         className='w-[200px]' 
                    //                                         defaultValue={person.name}
                    //                                         type='text'
                    //                                         onChange = {(event) => {
                    //                                             setCurrentName(event.target.value);
                    //                                             setEditedIndex(index);
                    //                                         }}
                    //                                         />
                    //                                     </DialogTitle>
                    //                                     <DialogDescription>
                    //                                         Edit person details and relationships.
                    //                                     </DialogDescription>
                    //                                 </DialogHeader>
                    //                                 <div className="plan-dialog-content">
                    //                                     <div>
                    //                                         something here
                    //                                     </div>
                    //                                     <ScrollArea>
                    //                                         <div className="flex flex-row gap-4">
                    //                                             <TypeDropdown/>
                    //                                             <RelationshipDropdown/>
                    //                                         </div>
                    //                                     </ScrollArea>
                    //                                 </div>
                    //                                 <DialogFooter>
                    //                                     <Button onClick = {() => {
                    //                                         removePerson(index);
                    //                                         toast.success('Deleted person.');
                    //                                     }}>Delete</Button>
                    //                                     <DialogClose>
                    //                                         <Button onClick={handleDialogSave}>Save</Button>
                    //                                     </DialogClose>
                    //                                 </DialogFooter>
                    //                             </DialogContent>
                    //                         </Dialog>
                    //                     </TableCell>
                    //                     <TableCell>{person.isConnected ? 'Connected' : 'Not Connected'}</TableCell>
                    //                 </TableRow>
                    //             ))}
                    //         </TableBody>
                    //     </Table>
                    // </ScrollArea>
            )}
        </div>
        </RelationshipsContext.Provider>
        </PeopleContext.Provider>
    </div>
  );
}
