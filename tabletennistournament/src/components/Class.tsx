import Player from "./Player";
import Group from "./Group";
import Match from "./Match";


interface Class {
  uid?: string;
  classId: number;
  tournamentId: number;
  name?: string;
  players?: Player[] | undefined;
  matches?: Match[];
  format?: string;
  numberInGroup?: number;
  seeds?: number;
  seededPlayersIds?: number[] | undefined;
  threeOrFive?: string;
  groups?: Group[];
  started?: boolean;
  classDrawn?: boolean;
  bo?: string;
  startBracket?: boolean;
  public?: string;
  rating?: number;
  advancingPlayers?: [Player, Player][] | undefined;
  
}
export default Class;
