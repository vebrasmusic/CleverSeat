'use client'

import * as React from "react"

import { useRef, useEffect, useState, useContext } from 'react';
import { Person, Relationship } from '@/classes/people';

import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
// @ts-ignore
import Cola from 'cytoscape-cola';
import edgehandles from 'cytoscape-edgehandles';

Cytoscape.use( edgehandles );
Cytoscape.use(Cola);

export default function RelGraph({people, relationships}: {people: Map<number, Person>, relationships: Map<number, Set<number>>}) {

    const [elements, setElements] = useState([]);
    const cy = useRef(null);

    const getWeight = (relationshipType: string) => {
        if (relationshipType === 'friend') {
            return 0.5;
        } else if (relationshipType === 'family') {
            return 1;
        } else if (relationshipType === 'acquaintance') {
            return 0.25;
        }
        return 0.25
    }

    useEffect(() => {
        const newElements = [];

        // nodes
        for (const [index, person] of people) {
            const nameParts = person.name.split(" ");
            const initials = nameParts.map(part => part.charAt(0).toUpperCase() + ".").join(" ");
            const position = { x: Math.random() * 50, y: Math.random() * 50 };
            newElements.push({ data: { id: index.toString(), label: initials }, position: position });
        }

        // edges
        const usedCombos = new Set<number>;
        for (const [index, relationshipSet] of relationships) {
            const sourceInd = index.toString();
            if (relationshipSet.size !== 0){
                for (const targ of relationshipSet){
                    const targetInd = targ.toString();
                    const newString = `${sourceInd}000000${targetInd}`;
                    const revNewString = `${targetInd}000000${sourceInd}`;

                    if (!usedCombos.has(Number(newString)) && !usedCombos.has(Number(revNewString))){
                        newElements.push({ data: { source: sourceInd, target: targetInd}});
                        usedCombos.add(Number(newString));
                        usedCombos.add(Number(revNewString));
                    }
                    else {
                        console.log("duplicate edge detected")
                    }
                }
            }
        }
        //@ts-ignore
        setElements(newElements);
    }, [people, relationships]);


    useEffect(() => {
        if (cy.current) {
                //@ts-ignore
                cy.current.layout({
                    name: 'cola',
                    animate: true,
                    padding: 50,
                    randomize: true,
                    avoidOverlap: true,
                    centerGraph: true,
                    //@ts-ignore
                    fit: true // Fits to screen after layout
                }).run();
            }

    }, [elements])

    return (
    <>
        <CytoscapeComponent 
        // @ts-ignore
        cy={(instance) => { cy.current = instance; }} // Assigning the Cytoscape instance to the ref
        stylesheet={[
            {
            selector: 'node',
            style: {
                "background-color": "white",
                label: 'data(label)',
            }
            },
            {
            selector: 'label',
            style: {
                "color": "white",
                "min-zoomed-font-size": 30,
            }
            },
            {
            selector: 'edge',
            style: {
                width: 4,
                "line-color": "mapData(weight, 0.25, 1, red, white)",
                'line-opacity': 0.9,
                'line-style': 'dashed',
                'curve-style': 'haystack'
            }
            },
            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    "line-opacity": 0.3,
                }
            },
            {
            selector: '.eh-hover',
            style: {
                "border-width": 1,
                "border-color": "gold",
                "z-index": 1000,
            }
            }
        ]}
        layout={{ 
            name: 'cola'
        }}
        elements={elements} className='w-full h-full bg-[#212922]' />
        </>
    )
}