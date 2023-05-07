import set from './Set';
interface   Match {
    matchId?: string;
    player1?: string;
    player2?: string;
    score?: set[];
    tournamentId?: string;
    round?: string;
    group?: string;
    winner?: string;
    loser?: string;
    date?: string;
}

export default Match;