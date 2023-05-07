import db from "./firebaseinit";
import { ref, set, get, update } from "firebase/database";
import Tournament from "../components/Tournament";

// function that writes a tournament to the database
// if tournament exists, update it
async function writeTournament(tournament: Tournament): Promise<void> {
  const tournamentRef = ref(db, `tournament/${tournament.tournamentId}`);
  const tournamentSnapshot = await get(tournamentRef);
  console.log(tournament.seededPlayers)

  if (tournamentSnapshot.exists()) {
    // Tournament already exists, update it
    await update(tournamentRef, {
      name: tournament.name,
      dateFrom: tournament.dateFrom,
      dateTo: tournament.dateTo,
      location: tournament.location,
      players: tournament.players,
      format: tournament.format,
      numberInGroup: tournament.numberInGroup,
      uid: tournament.uid,
      seeds: tournament.seeds,
      seededPlayers: tournament.seededPlayers,
    });
  } else {
    // Tournament does not exist, create it
    const tournamentListRef = ref(db, 'tournament');
    const tournamentListSnapshot = await get(tournamentListRef);
    const tournamentList = tournamentListSnapshot.val() || {};
    const maxTournamentId = Object.keys(tournamentList).reduce(
      (maxId, id) => {
        const tournamentId = parseInt(id);
        return tournamentId > maxId ? tournamentId : maxId;
      },
      0
    );
    const newTournamentId = Math.max(maxTournamentId + 1, tournament.tournamentId ?? 0);

    await set(tournamentRef, {
      tournamentId: newTournamentId,
      name: tournament.name,
      dateFrom: tournament.dateFrom,
      dateTo: tournament.dateTo,
      location: tournament.location,
      players: tournament.players,
      format: tournament.format,
      numberInGroup: tournament.numberInGroup,
      uid: tournament.uid,
      seeds: tournament.seeds,
      seededPlayers: tournament.seededPlayers,
      
    });
  }
}

// gets the uid of the tournament to display for user
export async function getTournamentsByUid(uid: string): Promise<Tournament[]> {
    const tournamentRef = ref(db, 'tournament');
    const tournamentSnapshot = await get(tournamentRef);
    const tournamentList = tournamentSnapshot.val() || {};
    const tournaments: Tournament[] = [];
    for (const id in tournamentList) {
      if (tournamentList.hasOwnProperty(id)) {
        const tournament = tournamentList[id];
        if (tournament.uid === uid) {
          tournaments.push(tournament);
        }
      }
    }
    return tournaments;
}

export default writeTournament;
