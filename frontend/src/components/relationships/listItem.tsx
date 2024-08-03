import { Person } from "@/classes/people"

interface ListItemInterface{
    person: Person
}

export const ListItem = ({person}:ListItemInterface) => {

    return (
        <div className="w-full hover:bg-gray-300 rounded-[4px] gap-5 p-2 text-white text-lg">
            {person.name}
        </div>
    )
}