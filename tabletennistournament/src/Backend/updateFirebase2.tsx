import { db } from "./firebaseinit";
import { ref, set, get, update } from "firebase/database";
import Tournament from "../components/Tournament";
import Class from "../components/Class";

export async function writeTournament2(tournament: Tournament): Promise<void> {
  const tournamentId = await getTournamentId();

  const tournamentRef = ref(db, `tournament/${tournamentId}`);
  const tournamentSnapshot = await get(tournamentRef);

  if (tournamentSnapshot.exists()) {
    console.log("Tournament exists, updating tournament");
    await updateTournament(tournamentRef, tournament);
  } else {
    console.log("Tournament does not exist, creating tournament");
    await createTournament(tournamentRef, tournamentId, tournament);
  }
}

async function getTournamentId(): Promise<number> {
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
  return maxTournamentId + 1;
}

async function  updateTournament(
  tournamentRef: any,
  tournament: Tournament
): Promise<void> {
  await update(tournamentRef, {
    name: tournament.name,
    dateFrom: tournament.dateFrom,
    dateTo: tournament.dateTo,
    location: tournament.location,
    uid: tournament.uid,
    // other properties to update
  });
}

async function createTournament(
  tournamentRef: any,
  tournamentId: number,
  tournament: Tournament
): Promise<void> {
  await set(tournamentRef, {
    tournamentId: tournamentId,
    name: tournament.name,
    dateFrom: tournament.dateFrom,
    dateTo: tournament.dateTo,
    location: tournament.location,
    uid: tournament.uid,
    public: tournament.public,
    // other properties to create
  });
}

export async function writeClass(update: boolean,classs: Class): Promise<number> {
  let classId = classs.classId;

  if (update === false){
    classId = await getClassId();
  }
  
  const classRef = ref(db, `class/${classId}`);
  const classSnapshot = await get(classRef);

  if (classSnapshot.exists()) {
    console.log("Class exists, updating class");
    await updateClass(classRef, classs);
  } else {
    console.log("Class does not exist, creating class");
    await createClass(classRef, classId, classs);
  }
  return classId;
}

async function getClassId(): Promise<number> {
  const classListRef = ref(db, "class");
  const classListSnapshot = await get(classListRef);
  const classList: Record<string, Class> = classListSnapshot.val() || {};
  let maxClassId: number = 0;

  Object.values<Class>(classList).forEach((classItem: Class) => {
    if (classItem.classId > maxClassId) {
      maxClassId = classItem.classId;
    }
  });

  return maxClassId + 1;
}


async function createClass(
  classRef: any,
  classId: number,
  classs: Class
): Promise<void> {
  await set(classRef, {
    classId: classId,
    tournamentId: classs.tournamentId,

    uid: classs.uid,
    name: classs.name,
    format: classs.format,
    numberInGroup: classs.numberInGroup,
    threeOrFive: classs.threeOrFive,
    players: [],
    seededPlayersIds: [],
    groups: [],
    started: false,
    matches: [],
    readyToStart: false,
    bo: classs.bo,
    public: classs.public,
  });
}

async function updateClass(classRef: any, classs: Class): Promise<void> {
  await update(classRef, {
    name: classs.name,
    format: classs.format,
    numberInGroup: classs.numberInGroup,
    threeOrFive: classs.threeOrFive,
    players: classs.players,
    seededPlayersIds: classs.seededPlayersIds,
    groups: classs.groups,
    started: classs.started,
    matches: classs.matches,
    readyToStart: classs.readyToStart,
    bo: classs.bo,
    public: classs.public,
    
  });
}

export async function loadTournamentClasses(
  tournamentId: number
): Promise<Class[]> {
  const classListRef = ref(db, "class");
  const classListSnapshot = await get(classListRef);
  const classList: Record<string, Class> = classListSnapshot.val() || {};
  const tournamentClasses: Class[] = [];

  for (const id in classList) {
    if (classList.hasOwnProperty(id)) {
      const classItem = classList[id];
      if (classItem.tournamentId === tournamentId) {
        tournamentClasses.push(classItem);
      }
    }
  }

  return tournamentClasses;
}
