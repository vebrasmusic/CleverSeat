'use client'

import Link from "next/link";
import { useRef } from 'react';
import gsap from 'gsap'; // <-- import GSAP
import { useGSAP } from '@gsap/react'; // <-- import the hook from our React package
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LargeInput } from "@/components/ large_input";
import { KeyboardIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
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
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
export default function Plan() {

    const animationContainer = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [currentName, setCurrentName] = useState('');
    const [names, setNames] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log(currentName);
    }, [currentName]);

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
    }, [isEditing]);

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

    const onEditMode = contextSafe(() => {
        gsap.to('.plan-div', { opacity: 1 });
    });

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        const newValue = event.currentTarget.value;

        setCurrentName(newValue); // Update state

        // Extract last name from the current input
        const lastName = newValue.split(' ').pop();

        // Check if this last name is already in the list of names
        const lastNameExists = names.some(name => name.split(' ').pop() === lastName);

        if (lastNameExists) {
            // Prompt the user
            console.log(`Last name "${lastName}" already exists!`);
        }

        if (event.key === "Enter") {
            setNames([...names, event.currentTarget.value]);
            setCurrentName('');
            event.currentTarget.value = ''; // Clear the input field
            // save the name to some storage
        } 
    }

  return (
    <div className="content-div" ref={animationContainer}>
        <div className="plan-div">
            {/* <div className="plan-header">
                <div className="plan-header-item">
                    <p>{`< Start over`}</p>
                </div>
            </div> */}
            {!isEditing ? (
                <div className="plan-content-div">
                    <input autoFocus className="plan-input" type="text" placeholder="start typing..." defaultValue={currentName} onKeyDown={handleKeyPress} />
                    <div className="plan-header-item">
                        <p className="text-[#D7263D]">Press ⏎ to save this name.</p>
                    </div>
                </div>
            ) : (
                <div className="plan-content-div">
                    <Table>
                        <TableCaption>List of current names in your seating plan.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {names.map((name) => (
                                <TableRow key={name}>
                                    <TableCell className="font-medium">
                                        <Dialog>
                                            <DialogTrigger>{name}</DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                <DialogTitle>{name}</DialogTitle>
                                                <DialogDescription>
                                                    Edit the relationships.
                                                </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>Connected</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    </div>
  );
}
