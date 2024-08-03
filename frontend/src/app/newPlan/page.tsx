import { Person } from "@/classes/people";
import { ListItem } from "@/components/relationships/listItem";
import RelGraph from "@/components/relationships/relGraph";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";










export default function NewPlan(){
    // left side => menu
    // right side => graph

    const person1 = new Person("Andres Duvvuri", false)
    const person2 = new Person("Andres Duvvuri", false)
    const person3 = new Person("Andres Duvvuri", false)
    const person4 = new Person("Andres Duvvuri", false)
    const person5 = new Person("Andres Duvvuri", false)
    const person6 = new Person("Andres Duvvuri", false)
    const person7 = new Person("Andres Duvvuri", false)
    const person8 = new Person("Andres Duvvuri", false)
    const person9 = new Person("Andres Duvvuri", false)
    const person10 = new Person("Andres Duvvuri", false)
    const person11 = new Person("Andres Duvvuri", false)
    const person12 = new Person("Andres Duvvuri", false)
    const person13 = new Person("Andres Duvvuri", false)

    const people: Person[] = [
        person1,
        person2,
        person3,
        person4,
        person5,
        person6,
        person7,
        person8,
        person9,
        person10,
        person11,
        person12,
        person13
    ];





    return (
        <div id="main" className="flex flex-row items-stretch align-middle bg-[#212922] h-full w-full"> 
            <div id="menu" className="flex flex-col items-center align-middle p-6 border-r-[0.5px] w-[300px] gap-10">
                <div className="text-white text-[25px]">
                    Graph Tools
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Create</div>
                    <div className="flex flex-row gap-6">
                        <Button className="w-full bg-transparent" variant={"outline"}>
                            {/* Person */}
                        </Button>
                        <Button className="w-full bg-transparent" variant={"outline"}>
                            {/* family */}
                        </Button>
                        <Button className="w-full bg-transparent" variant={"outline"}>
                            {/* edge */}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">Edit</div>
                    <div className="flex flex-row gap-6">
                        <Button className="w-full bg-transparent" variant={"outline"}>
                            {/* delete */}
                        </Button>
                        <Button className="w-full bg-transparent" variant={"outline"}>
                            {/* undo */}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-3 border-b-[0.5px] w-full">
                    <div className="text-white text-[16px]">List of people</div>
                    <ScrollArea className="flex flex-col gap-2 overflow-scroll">
                        {people.map((person, key) => {
                            return <ListItem key={key} person={person}/>;
                        })}
                        {/* map of list item components */}
                    </ScrollArea>
                </div>
            </div>
            {/* <RelGraph/> */}
        </div>







    )
}