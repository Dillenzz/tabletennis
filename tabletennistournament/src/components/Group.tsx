import  Player  from "./Player";
import  Match  from "./Match";


interface Group{
    name?: string;
    players?: Player[];
    matches?: Match[];
    format?: string;
    numberInGroup?: string;
    tournamentId?: number;
}

export default Group;