export interface Person {
    fn: string;
    ln: string;
    isConnected: boolean;
    relationships: Relationship[];
}

export interface Relationship {
    name: string;
    score: number;
}


