import db from "./firebaseinit";
import { ref, set, get, update } from "firebase/database";
import Tournament from "../components/Tournament";

// function that writes a tournament to the database
// if tournament exists, update it

// function that writes a tournament to the database
// if tournament exists, update it
async function writeTournament(tournament: Tournament): Promise<void> {
  const tournamentListRef = ref(db, "tournament");
  const tournamentListSnapshot = await get(tournamentListRef);
  const tournamentList = tournamentListSnapshot.val() || {};
  let maxTournamentId: number = 0;
  if (tournamentList) {
    maxTournamentId = Object.keys(tournamentList).reduce((maxId, id) => {
      const tournamentId = parseInt(id);
      return tournamentId > maxId ? tournamentId : maxId;
    }, 0);
  }
  console.log(tournament.tournamentId)
  const newTournamentId =
    tournament.tournamentId === undefined
      ? maxTournamentId + 1
      : tournament.tournamentId;
  console.log("New tournament id: " + newTournamentId);
  
  const tournamentRef = ref(db, `tournament/${newTournamentId}`);
  const tournamentSnapshot = await get(tournamentRef);

  if (tournamentSnapshot.exists()) {
    console.log("Tournament already exists");
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
      seededPlayersIds: tournament.seededPlayersIds,
      threeOrFive: tournament.threeOrFive,
    });
  } else {
    // Tournament does not exist, create it
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
      seededPlayersIds: tournament.seededPlayersIds,
      threeOrFive: tournament.threeOrFive,
    });
    console.log("Tournament created");
  }
}

// gets the uid of the tournament to display for user
export async function getTournamentsByUid(uid: string): Promise<Tournament[]> {
  const tournamentRef = ref(db, "tournament");
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
