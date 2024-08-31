'use client'

import * as React from "react"

import { useRef, useEffect, useState, useContext } from 'react';
import { Person, Relationship } from '@/classes/people';

import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
// @ts-ignore
import Cola from 'cytoscape-cola';
import edgehandles from 'cytoscape-edgehandles';
// @ts-ignore
import coseBilkent from 'cytoscape-cose-bilkent';
// @ts-ignore
import avsdf from 'cytoscape-avsdf';


Cytoscape.use( edgehandles );
// Cytoscape.use(coseBilkent);
Cytoscape.use(avsdf)

export default function RelGraph({people, relationships}: {people: Map<number, Person>, relationships: Map<number, Map<number, number>>}) {

    const [elements, setElements] = useState([]);
    const cy = useRef(null);

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
        for (const [index, relationshipMap] of relationships) {
            const sourceInd = index.toString();
            if (relationshipMap.size !== 0){
                for (const [targ, weight] of relationshipMap){
                    const targetInd = targ.toString();
                    const newString = `${sourceInd}000000${targetInd}`;
                    const revNewString = `${targetInd}000000${sourceInd}`;

                    if (!usedCombos.has(Number(newString)) && !usedCombos.has(Number(revNewString))){
                        newElements.push({ data: { source: sourceInd, target: targetInd, weight: weight}});
                        usedCombos.add(Number(newString));
                        usedCombos.add(Number(revNewString));
                    }
                }
            }
        }
        //@ts-ignore
        setElements(newElements);
    }, [people, relationships]);


    useEffect(() => {
        if (cy.current) {
            try {
                console.log("Applying layout with elements:", elements);
                //@ts-ignore
                // cy.current.layout({
                //     name: 'cose-bilkent',
                //     nodeRepulsion: 10000,
                //     // idealEdgeLength: 
                //     edgeElasticity: 0.8,
                //     nestingFactor: 0.1,
                //     gravity: 0.25,
                //     numIter: 2500,
                //     tile: true,
                //     animate: 'during',
                //     animationDuration: 1000,
                //     fit: true,
                //     padding: 30,
                //     randomize: true,
                //     componentSpacing: 300,
                //     nodeDimensionsIncludeLabels: true,
                //     refresh: 10,
                // }).run();
                cy.current.layout({
                        name: 'avsdf',
                        nodeSeparation: 60,
                        refresh: 20,
                        fit: true
                    }).run();
            } catch (error) {
                console.error("Layout error:", error);
                console.log("Elements:", elements);
            }
        }
    }, [elements]);

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
                "color": "white",
                "text-border-opacity": 100
            }
            },
            {
            selector: 'edge',
            style: {
                width: 1,
                "line-color": (ele) => {
                    const weight = ele.data('weight');
                    if (weight <= 0.2) return 'red';
                    if (weight <= 0.6) return 'orange';
                    if (weight <= 0.8) return 'yellow';
                    return 'white';
                },                'line-opacity': 0.9,
                'line-style': 'solid',
                'curve-style': 'haystack'
            }
            }
        ]}
        layout={{ 
            name: 'avsdf'
        }}
        maxZoom={5}
        minZoom={0.5}        
        elements={elements} className='w-full h-full bg-[#212922]' />
        </>
    )
}