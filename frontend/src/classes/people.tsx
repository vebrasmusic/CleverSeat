export class Person {

    constructor(name: string, isConnected: boolean) {
        this.name = name;
        this.isConnected = isConnected;
        this.family = null;
    }

    name: string;
    isConnected: boolean;
    family: null | number;

    addToFamily(familyIndex: number){
        this.family = familyIndex;
    }

    removeFromFamily(){
        this.family = null;
    }
}
export class Family {
    constructor(name: string) {
        this.name = name;
        this.members = new Set;
    }

    name: string;
    members: Set<number>;


    addToFamily(personIndex: number){
        this.members.add(personIndex);
    }

    removeFromFamily(personIndex: number){
        if (this.members.has(personIndex)){
            this.members.delete(personIndex)
        }
    }
}

export class AGraph {
    nodes: Person[];

    constructor(){
        this.nodes = [];
    }

    addPerson(){
        const person = new Person("random", false)
        this.nodes.push(person)
    }

    removePerson(){
        this.nodes.pop;
    }
}

export class Relationship {
    node1: Person;
    node2: Person;
    relationshipType: string;

    constructor(node1: Person, node2: Person, relationshipType: string) {
        this.node1 = node1;
        this.node2 = node2;
        this.relationshipType = relationshipType;
    }
}

export class RelationshipGraph {
    relationships: Relationship[] = [];

    addRelationship(node1: Person, node2: Person, relationshipType: string) {
        this.relationships.push(new Relationship(node1, node2, relationshipType));
    }

    removeRelationship(node1: Person, node2: Person, relationshipType: string) {
        this.relationships = this.relationships.filter(r => r.node1 !== node1 && r.node2 !== node2 && r.relationshipType !== relationshipType);
    }

    // Method to find all relationships for a given person
    findRelationshipsForPerson(person: Person): Relationship[] {
        return this.relationships.filter(r => r.node1 === person || r.node2 === person);
    }
}

