import { createContext} from 'react';
import {Person} from '@/classes/people';

export const PeopleContext = createContext<Person[]>([]);

