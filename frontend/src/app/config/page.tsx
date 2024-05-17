'use client'

import Link from "next/link";
import { useRef } from 'react';
import gsap from 'gsap'; // <-- import GSAP
import { useGSAP } from '@gsap/react'; // <-- import the hook from our React package
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Config() {

    const animationContainer = useRef<HTMLDivElement>(null);
    const router = useRouter();

  useGSAP(
    () => {
      gsap.to('.config-div', {
        opacity: 1,
        duration: 1,
      });
    },
    {
      scope: animationContainer,
    }
  )

  return (
    <div className="content-div" ref={animationContainer}>
        <div className="config-div">
            <div className="config-div-title">
                <h2>Seating Plan Configuration</h2>
                <p className="text-{#6B7280}">Configure your seating plan here.</p>
            </div>
            <div className="config-card">
                <div>
                    <p className="italic">Don't worry, you can change this later</p>
                </div>
                <div className="config-card-content">
                    <div className="config-card-subdiv">
                        <div className="config-card-option">
                            <Label>Plan Name</Label>
                            <Input type="text" placeholder="Example Plan"/>
                        </div>
                        <div className="config-card-option">
                            <Label>Plan Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wedding" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="wedding">Wedding</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="config-card-subdiv">
                        <div className="config-card-option">
                            <Label>Table Shape</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Round" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="round">Round</SelectItem>
                                        <SelectItem value="rectangular">Rectangular &#40;Long&#41;</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="config-card-option">
                            <Label>Heads per Table</Label>
                            <Input type="number" placeholder="8"/>
                        </div>
                        <div className="config-card-option">
                            <Label># of tables</Label>
                            <Input type="number" placeholder="15"/>
                        </div>
                    </div>
                </div>
                <Button onClick={() => {
                    // TODO: save to local storage
                    router.push('/plan')
                }}>Continue</Button>
            </div>
        </div>
    </div>
  );
}
