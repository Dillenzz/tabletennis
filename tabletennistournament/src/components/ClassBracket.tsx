import  Match  from "./Match";
import  Player  from "./Player";
import ClassBracketNode from "./ClassBracketNode";
import { Box} from "@chakra-ui/react";

interface ClassBracket {
    root?: ClassBracketNode;
    matches?: Match[];
    players?: Player[][];
    tournamentId?: number;
    classId?: number;
}

function ClassBracket() {
    return (
        <Box>
            
        </Box>
    );
}
export default ClassBracket;