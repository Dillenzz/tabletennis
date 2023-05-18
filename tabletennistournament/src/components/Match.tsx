import Player from './Player';
import set from './Set';
interface   Match {
    matchId?: number;
    player1?: Player;
    player2?: Player;
    score?: set[];
    tournamentId?: number;
    round?: string;
    group?: number;
    winner?: string;
    loser?: string;
    date?: string;
}

export default Match;