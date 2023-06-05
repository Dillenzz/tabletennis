import db from "./firebaseinit";
import { ref, set, get } from "firebase/database";
import Tournament from "../components/Tournament";

async function deleteTournament(tournament: Tournament): Promise<void> {
    const tournamentRef = ref(db, `tournament/${tournament.tournamentId}`);
    const tournamentSnapshot = await get(tournamentRef);
  
    if (tournamentSnapshot.exists()) {
      await set(tournamentRef, null);
      console.log("Tournament deleted");
    } else {
      console.log("Tournament does not exist");
    }
  }

export default deleteTournament;
  