import { v4 as uuidv4 } from 'uuid';
import { Person } from './person';

export class Family {
    id: string;
    name: string;
    members: Map<string, Person>; // < personId, Person>

    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
        this.members = new Map();
    }

    addMember(member: Person) {
        if (!this.members.has(member.id)){
            try {
                this.members.set(member.id, member);
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        else {
            console.error('has member')
        }
    }

    deleteMember(memberId: string) {
        this.members.delete(memberId);
    }
}