"use client";

import { createContext } from "react";
import { RelationshipGraph } from "@/classes/people";

export const RelationshipsContext = createContext<RelationshipGraph>(new RelationshipGraph());

