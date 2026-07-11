import type { Metadata } from "next";
import { OpportunityMapper } from "./opportunity-mapper";
export const metadata:Metadata={title:"Digital Opportunity Mapper",description:"Turn a business challenge into a useful first-pass website, software or AI automation roadmap in about three minutes.",alternates:{canonical:"/opportunity-mapper"}};
export default function MapperPage(){return <OpportunityMapper/>}
