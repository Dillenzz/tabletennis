import {db} from "./firebaseinit";
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
  
  const newTournamentId =
    tournament.tournamentId === undefined
      ? maxTournamentId + 1
      : tournament.tournamentId;
  
  
  const tournamentRef = ref(db, `tournament/${newTournamentId}`);
  const tournamentSnapshot = await get(tournamentRef);

  if (tournamentSnapshot.exists()) {
    console.log("Tournament exists updating tournament");
    // Tournament already exists, update it
    //console.log(tournament.players);
    await update(tournamentRef, {
      name: tournament.name,
      dateFrom: tournament.dateFrom,
      dateTo: tournament.dateTo,
      location: tournament.location,
      players: tournament.players,
      format: tournament.format,
      numberInGroup: tournament.numberInGroup,
      uid: tournament.uid,
      seededPlayersIds: tournament.seededPlayersIds ? tournament.seededPlayersIds : [],
      threeOrFive: tournament.threeOrFive,
      groups: tournament.groups,
      started: tournament.started,
      matches: tournament.matches,
      readyToStart: tournament.readyToStart,
      bo: tournament.bo,
      public: tournament.public,
      
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
      groups: tournament.groups,
      started: tournament.started,
      matches: tournament.matches,
      readyToStart: false,
      bo: tournament.bo,
      public: tournament.public,
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

export async function getAllPublicTournaments(): Promise<Tournament[]> {
  const tournamentRef = ref(db, "tournament");
  const tournamentSnapshot = await get(tournamentRef);
  const tournamentList = tournamentSnapshot.val() || {};
  const tournaments: Tournament[] = [];
  for (const id in tournamentList) {
    if (tournamentList.hasOwnProperty(id)) {
      const tournament = tournamentList[id];
      if (tournament.public === "Public") {
        tournaments.push(tournament);
      }
    }
  }
  return tournaments;
}

export default writeTournament;
