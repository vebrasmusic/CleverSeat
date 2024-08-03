'use client'

import * as React from "react"

import { useRef, useEffect, useState, useContext } from 'react';
import { Person, Relationship } from '@/classes/people';
import { toast } from 'sonner';

import { PeopleContext } from '@/context/peopleContext';
import { RelationshipsContext } from '@/context/relationshipsContext';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
// @ts-ignore
import Cola from 'cytoscape-cola';
import edgehandles from 'cytoscape-edgehandles';
import { Button } from '@/components/ui/button';

Cytoscape.use( edgehandles );
Cytoscape.use(Cola);

export default function RelGraph() {

    const people = useContext(PeopleContext); // nodes
    const relationshipGraph = useContext(RelationshipsContext); // edges

    const relationships = relationshipGraph.relationships;

    const elements = [];

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

    const autoConnectFamilyMembers = () => {
        for (const person of people) {
            for (const otherPerson of people) {
                if (person.name !== otherPerson.name && person.name.split(' ').slice(-1)[0] === otherPerson.name.split(' ').slice(-1)[0] ) {
                    const existingRelationship = relationships.find(r => 
                        (r.node1 === person && r.node2 === otherPerson) || 
                        (r.node1 === otherPerson && r.node2 === person)
                    );
                    if (!existingRelationship) {
                        relationshipGraph.addRelationship(person, otherPerson, 'family');
                    }
                }
            }
        }
        toast.success('Family connected, please press tab to refresh');
    }

    for (const person of people) { // making nodes from the created people
        const position = { x: Math.random() * 50, y: Math.random() * 50 };
        elements.push({ data: { id: person.name, label: person.name }, position: position });
    }
    for (const relationship of relationships) { // making edges from the created relationships
        elements.push({ data: { source: relationship.node1.name, target: relationship.node2.name, weight: getWeight(relationship.relationshipType) } });
    }

    const cy = useRef(null);

    let defaults = {
        //@ts-ignore
        canConnect: function( sourceNode, targetNode ){
          // whether an edge can be created between source and target
          return !sourceNode.same(targetNode); // e.g. disallow loops
        },
        snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive) 
        hoverDelay: 150, // time spent hovering over a target node before it is considered selected
        snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
        noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
        disableBrowserGestures: true // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    };


    useEffect(() => { // handles the edgehandles enabling, so i can drag edges
        if (cy.current) {
            //@ts-ignore
            const eh = cy.current.edgehandles(defaults);
            eh.enableDrawMode()
        }
    }, [cy])

    useEffect(() => {
        if (cy.current) {
            //@ts-ignore
            cy.current.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
                // console.log(
                //     "source", sourceNode.data('id'),
                //     "target", targetNode.data('id'),
                // )
                const person1 = new Person(sourceNode.data('id'), true);
                const person2 = new Person(targetNode.data('id'), true);
                
                relationshipGraph.addRelationship(person1, person2, 'friend');
            })
        }
    }, [cy])

    // //@ts-ignore
    // cy.current.add({
    //     group: 'nodes',
    //     data: { id: id, label: num.toString() },
    //     position: { x: Math.random() * 100, y: Math.random() * 100 }
    // });
    // //@ts-ignore
    // cy.current.add({
    //     group: 'edges',
    //     //@ts-ignore
    //     data: { source: cy.current.nodes()[Math.floor(Math.random() * cy.current.nodes().length)].id(), target: id, label: 'Edge from Node1 to Node2', length: [0.25, 0.5, 1][Math.floor(Math.random() * 3)] }
    // });

    return (
    <>
        <div className='flex justify-center items-center flex-row'>
            <Button onClick={() => { //refresh layout button
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
            }}>
                    Clean up
                </Button>
                <Button onClick={() => {
                    autoConnectFamilyMembers();
                }}>
                    Auto-connect family members
                </Button>
        </div>

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
                'line-opacity': 0.8,
                'line-style': 'dashed',
                'curve-style': 'haystack'
            }
            },
            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    "line-opacity": 0.1,
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