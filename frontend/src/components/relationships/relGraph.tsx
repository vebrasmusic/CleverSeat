'use client'

import * as React from "react"

import { useRef, useEffect, useState, useContext } from 'react';
import { Family, Person, Relationship } from '@/classes/people';

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
Cytoscape.use(Cola)

export default function RelGraph({people, relationships, weights}: {people: Map<number, Person | Family>, relationships: Map<number, Map<number, number>>, weights: number[]}) {

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
                    name: 'cola',
                    animate: true, // whether to show the layout as it's running
                    refresh: 1, // number of ticks per frame; higher is faster but more jerky
                    maxSimulationTime: 4000, // max length in ms to run the layout
                    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
                    fit: true, // on every layout reposition of nodes, fit the viewport
                    padding: 0, // padding around the simulation

                    // positioning options
                    randomize: true, // use random node positions at beginning of layout
                    avoidOverlap: true, // if true, prevents overlap of node bounding boxes
                    handleDisconnected: true, // if true, avoids disconnected components from overlapping

                    

                    // different methods of specifying edge length
                    // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
                    edgeLength: function(edge) {
                        const scaleFactor = 1
                        const weight = parseFloat(edge.data('weight'));
                        const len = 100 / Math.log(weight * scaleFactor + 1); // Adjust the scaling factor as needed
                        return len;
                    }, // sets edge length directly in simulation
                    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
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
                selector: 'node:parent', // This selector targets compound nodes
                style: {
                    'background-color': '#f0f0f0',
                    'border-color': '#000',
                    'border-width': 2,
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'shape': 'roundrectangle'
                }
                },
            {
            selector: 'edge',
            style: {
                width: 1,
                "line-color": (ele) => {
                    const weight = ele.data('weight');
                    if (weight <= weights[3]) return 'red';
                    if (weight <= weights[2]) return 'orange';
                    if (weight <= weights[1]) return 'yellow';
                    return 'white';
                },                
                'line-opacity': 0.4,
                'line-style': 'solid',
                'curve-style': 'haystack'
            }
            }
        ]}
        layout={{ 
            name: 'cola'
        }}
        maxZoom={5}
        minZoom={0.5}        
        elements={elements} className='w-full h-full bg-[#212922]' />
        </>
    )
}