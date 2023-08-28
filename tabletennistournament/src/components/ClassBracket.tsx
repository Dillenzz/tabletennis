import  Match  from "./Match";
import  Player  from "./Player";
import ClassBracketNode from "./ClassBracketNode";
import { Box} from "@chakra-ui/react";

interface ClassBracket {
    root?: ClassBracketNode
    matches?: Match[];
    players?: Player[][];
    tournamentId?: number;
    classId?: number;
}

function ClassBracket(props: ClassBracket | undefined) {
    
    console.log(props?.matches, "matches1");

    let matchesReversed = props?.matches ? [...props.matches].reverse() : [];

    console.log(matchesReversed, "matches2");

    return (
        <Box>
           
           { <ClassBracketNode up={props?.root?.up} down={props?.root?.down} match={props?.root?.match} level={props?.root?.level} matchNumber={props?.root?.level}  /> } 
        </Box>
    );
}
export default ClassBracket;