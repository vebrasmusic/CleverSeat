import { v4 as uuidv4 } from 'uuid';

export class Family {
    id: string;
    name: string;
    members: Set<string>;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.members = new Set();
    }

    addMember(memberId: string) {
        if (!this.members.has(memberId)){
            try {
                this.members.add(memberId);
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