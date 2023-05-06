import db from "./firebaseinit";
import { ref, set, get } from "firebase/database";

interface Tournament {
    tournamentId?: string;
    uid?: string;
    name?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    players?: string;
    format?: string;
    numberInGroup?: string;
  }


async function writeTournament(tournament: Tournament): Promise<void>  {
  const tournamentRef = ref(db, 'tournament');
  const tournamentSnapshot = await get(tournamentRef);
  const tournamentList = tournamentSnapshot.val() || {};
  const maxTournamentId = Object.keys(tournamentList).reduce((maxId, id) => {
    const tournamentId = parseInt(id);
    return tournamentId > maxId ? tournamentId : maxId;
  }, 0);

  const newTournamentId = maxTournamentId + 1;
  const reference = ref(db, `tournament/${newTournamentId}`);

  set(reference, {
    tournamentId: newTournamentId,
    name: tournament.name,
    dateFrom: tournament.dateFrom,
    dateTo: tournament.dateTo,
    location: tournament.location,
    players: tournament.players,
    format: tournament.format,
    numberInGroup: tournament.numberInGroup,
    uid: tournament.uid
  });
}

export default writeTournament;
