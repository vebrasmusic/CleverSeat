'use client'

import Image from "next/image";
import Link from "next/link";
import { useRef } from 'react';
import gsap from 'gsap'; // <-- import GSAP
import { useGSAP } from '@gsap/react'; // <-- import the hook from our React package
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


gsap.registerPlugin(useGSAP);

export default function Home() {
  const animationContainer = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      gsap.to('.main-title', {
        opacity: 1,
        duration: 1,
        onComplete: () => {
          gsap.to('.sub-title', {
            opacity: 1,
            duration: 1,
            onComplete: () => {
              gsap.to('.content-div-new-plan-button', {
                opacity: 1,
                duration: 1,
              });
            }
          });
        }
      });
    },
    {
      scope: animationContainer,
    }
  )

  return (
    <div className="content-div" ref={animationContainer}>
      <div className="content-div-title">
        <h1 className="main-title">Seating is hard.</h1>
        <h2 className="sub-title" style={{ fontStyle: 'italic' }}>&#40;it doesn&#39;t have to be&#41;</h2>
      </div>
      <Button className="content-div-new-plan-button" onClick={() => {
        router.push('/config')
      }}>
          <p>
              start a new seating plan...
          </p>
      </Button>
    </div>
  );
}
