import type { Metadata } from "next";
import { OpportunityMapper } from "./opportunity-mapper";
export const metadata:Metadata={title:"Free Digital Opportunity Scorecard",description:"Score your next website, software or AI opportunity and receive a practical three-step route in about three minutes.",alternates:{canonical:"/opportunity-mapper"}};
export default function MapperPage(){return <OpportunityMapper/>}
