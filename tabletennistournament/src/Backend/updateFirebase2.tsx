import { db } from "./firebaseinit";
import { ref, set, get, update } from "firebase/database";
import Tournament from "../components/Tournament";
import Class from "../components/Class";

export async function writeTournament2(tournament: Tournament): Promise<void> {
  console.log("tournament ID inside writeTournament2", tournament.tournamentId);

  if (tournament.tournamentId === -1) {
    const tournamentListRef = ref(db, "tournament");
    const tournamentListSnapshot = await get(tournamentListRef);
    const tournamentList = tournamentListSnapshot.val() || {};

    const maxTournamentId = await getTournamentId(tournamentList);
    const tournamentId = maxTournamentId + 1;

    console.log("Creating new tournament with ID", tournamentId);

    const tournamentRef = ref(db, `tournament/${tournamentId}`);
    await createTournament(tournamentRef, tournamentId, tournament);
  } else {
    const tournamentRef = ref(db, `tournament/${tournament.tournamentId}`);
    const tournamentSnapshot = await get(tournamentRef);

    if (tournamentSnapshot.exists()) {
      console.log("Tournament exists, updating tournament");
      await updateTournament(tournamentRef, tournament);
    } else {
      console.log("Tournament does not exist");
      // Handle the scenario when the provided tournament ID does not exist
    }
  }
}

async function getTournamentId(tournamentList: any): Promise<number> {
  let maxTournamentId: number = 0;

  // Iterate over the existing tournaments and find the maximum tournamentId
  Object.values(tournamentList).forEach((tournament: any) => {
    const tournamentId = tournament.tournamentId;
    if (tournamentId > maxTournamentId) {
      maxTournamentId = tournamentId;
    }
  });

  return maxTournamentId;
}

async function updateTournament(
  tournamentRef: any,
  tournament: Tournament
): Promise<void> {
  await update(tournamentRef, {
    name: tournament.name,
    dateFrom: tournament.dateFrom,
    dateTo: tournament.dateTo,
    location: tournament.location,
    uid: tournament.uid,
    public: tournament.public,
    club: tournament.club,
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
    club: tournament.club,
    // other properties to create
  });
}


export async function writeClass(classs: Class): Promise<number> {
  console.log("class ", classs.classId);
  let classId = classs.classId;

  if (classId === -1) {
    classId = await generateNewClassId();
    console.log("Creating new class with ID", classId);

    // Set the new classId value in the classs object
    classs.classId = classId;
    const classRef = ref(db, `class/${classId}`);
    await createClass(classRef, classId, classs);
  } else {
    // Existing class, update it using classId directly
    const classRef = ref(db, `class/${classId}`);
    const classSnapshot = await get(classRef);
    console.log("classSnapshot.exists()", classSnapshot.exists());
    if (classSnapshot.exists()) {
      console.log("Class exists, updating class");
      await updateClass(classRef, classs);
    }
  }

  return classId;
}



async function generateNewClassId(): Promise<number> {
  const classListRef = ref(db, "class");
  const classListSnapshot = await get(classListRef);
  const classList: Record<string, Class> = classListSnapshot.val() || {};

  let minClassId: number = 1;

  if (Object.keys(classList).length > 0) {
    classListSnapshot.forEach((classItemSnapshot: any) => {
      const classItem = classItemSnapshot.val();
      if (classItem.classId >= minClassId) {
        minClassId = classItem.classId + 1;
      }
    });
  }
  console.log("minClassId", minClassId);
  return minClassId;
}


async function createClass(
  classRef: any,
  classId: number,
  classs: Class
): Promise<void> {
  // Generate the new classId if it is -1
  console.log(classId, "inside createClass")
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
    classDrawn: false,
    bo: classs.bo,
    public: classs.public,
  });
}

async function updateClass(classRef: any, classs: Class): Promise<void> {
  console.log(classs, "inside updateClass")
  await update(classRef, {
    name: classs.name,
    format: classs.format,
    numberInGroup: classs.numberInGroup,
    threeOrFive: classs.threeOrFive,
    players: classs.players? classs.players : [],
    seededPlayersIds: classs.seededPlayersIds? classs.seededPlayersIds : [],
    groups: classs.groups? classs.groups : [],
    started: classs.started,
    matches: classs.matches ? classs.matches : [],
    classDrawn: classs.classDrawn,
    
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
  console.log(tournaments);
  return tournaments;
}
