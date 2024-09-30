'use client'
import { Family } from "@/classes/family";
import DraggableComponent from "@/components/draggableComponent"
import DragWrapper from "@/components/dragWrapper";
import DroppableComponent from "@/components/droppableComponent"
import { Button } from "@/components/ui/button";
import {DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent} from "@dnd-kit/core"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DragDrop() {

    const [families, setFamilies] = useState<Map<string, Family>>(new Map()
                                    .set(uuidv4(), new Family("Duvvuri"))
                                    .set(uuidv4(), new Family("Beltran"))
                                    .set(uuidv4(), new Family("Gomez"))
                                    .set(uuidv4(), new Family("Whitman"))
                                    .set(uuidv4(), new Family("Schrader"))
                                    .set(uuidv4(), new Family("Meme"))
                                );
    const [activeId, setActiveId] = useState<string | null>();
    const [prevContainer, setPrevContainer] = useState<string | null>(null);

    const [alphabeticalMap, setAlphabeticalMap] = useState<Map<string, Set<string>>>(new Map());
    const [names, setNames] = useState<Map<string, string>>(new Map()
                                    .set(uuidv4(), "Andres Duvvuri")
                                    .set(uuidv4(), "Clarisa Duvvuri")
                                    .set(uuidv4(), "Kimberly Vasquez")
                                    .set(uuidv4(), "Lord Farquad")
                                    .set(uuidv4(), "Gomex Gomex")
                                    .set(uuidv4(), "Hank Shcarder")
                                    .set(uuidv4(), "Salazr pat")
                                    .set(uuidv4(), "Pussy Bompansiero")
                                    .set(uuidv4(), "Gorlami B.")
                                    .set(uuidv4(), "Karina Duvvuri"));


    // change this to run on setFamilies, for now it has to run once in the beginning
    useEffect(() => {
        function findFirstLetter(name: string) {
            const nameParts = name.trim().split(/\s+/);
            const lastName = nameParts[nameParts.length - 1];
            return lastName ? lastName.charAt(0).toUpperCase() : '';
        }

        setAlphabeticalMap(prev => {
            const newMap = new Map(prev);

            names.forEach((name:string, id:string) => {
                const firstLetter = findFirstLetter(name);
                const oldSet = newMap.get(firstLetter) || new Set();
                oldSet.add(id);
                newMap.set(firstLetter, oldSet);
            })

            return newMap;
        })
    }, [names])

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        if (event.over !== null) {
            const draggedId = event.active.id.toString();
            const droppedOnId = event.over.id.toString();
            addMemberToFamily(droppedOnId, draggedId);
        }

        if (prevContainer){
            deleteMemberFromFamily(prevContainer, event.active.id.toString());
        }

        setPrevContainer(null);
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id.toString());
        //display drag overlay
    }

    function handleDragOver(event: DragOverEvent) {
        // display the preview
        if (event.over && event.active){
            const currentFamily = families.get(event.over.id.toString());
            if (currentFamily?.members.has(event.active.id.toString())) { // if the moved thing is in the family, then add to prev
                setPrevContainer(event.over.id.toString());
            }
        }
    }

    function addFamily(){
        // get family name state from input 
        const familyName = "Duvvuri";

        setFamilies(prev => {
            const newMap = new Map(prev);
            const newFamily = new Family(familyName);
            newMap.set(newFamily.id, newFamily);
            return newMap;
        });
    }

    function addMemberToFamily(familyId: string, memberId: string){
        setFamilies(prev => {
            const newMap = new Map(prev);
            const updatedFamily = newMap.get(familyId);
            if (updatedFamily) {
                updatedFamily.addMember(memberId);
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
        <DndContext onDragEnd={(event) => handleDragEnd(event)}
         onDragOver={(event) => handleDragOver(event)} 
         onDragStart={(event) => handleDragStart(event)}>
            {/* <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                panning={{
                    allowMiddleClickPan: true,
                    allowLeftClickPan: false,
                    allowRightClickPan:false
                }}
            >
                        <TransformComponent wrapperClass="!w-full !h-screen" contentClass="!w-full !h-full"> */}
                            <div className="flex flex-row w-full h-full gap-3 p-3">
                                {/* left side div */}
                                <div className="flex flex-col gap-2 w-1/3 border-4 border-red-500 h-full overflow-y-auto">
                                    {Array.from(families.entries()).map(([key, family]) => (
                                            <DroppableComponent key={key} id={key} familyName={family.name}>
                                                {Array.from(family.members.entries()).map(([memberId]) => (
                                                    <DraggableComponent key={memberId} name={names.get(memberId) || ""} id={memberId} inFamily={true}>
                                                    </DraggableComponent>
                                                ))}
                                            </DroppableComponent>
                                        ))}
                                </div>
                                <div className="flex flex-col gap-2 p-0 flex-shrink border-4 border-blue-500 overflow-y-auto h-full">   
                                        {Array.from(alphabeticalMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([letter, set]) => (
                                            <div key={letter} className="flex flex-col">
                                                <h3 className="text-[80px]">{letter}</h3>
                                                <div className="flex flex-row gap-2">
                                                    {Array.from(set).map((id) => (
                                                        <DraggableComponent id={id} name={names.get(id) || "not found"} key={id} inFamily={false}>
                                                        </DraggableComponent>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <DragOverlay>
                                        {activeId ? (
                                            <DragWrapper isActive name={names.get(activeId) || "Can't find"} inFamily={false}>
                                            </DragWrapper>
                                        ): null}
                                </DragOverlay>   
                            </div>
                        {/* </TransformComponent>
            </TransformWrapper> */}
        </DndContext>
    )
}

