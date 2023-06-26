import { db } from "./firebaseinit";
import { get, remove, ref } from "firebase/database";

async function deleteClassesByTournamentId(tournamentId: number): Promise<void> {
  const classesRef = ref(db, "class");
  const classesSnapshot = await get(classesRef);

  if (classesSnapshot.exists()) {
    const classesData = classesSnapshot.val();  

    // Iterate through each classId
    Object.keys(classesData).forEach(async (classId) => {
      const classData = classesData[classId];

      if (classData.tournamentId === tournamentId) {
        const classRef = ref(db, `class/${classId}`);

        try {
          await remove(classRef);
          console.log(`Class deleted: ${classId}`);
        } catch (error) {
          console.error(`Error deleting class: ${classId}`, error);
        }
      }
    });

    console.log("All classes with the specified tournamentId have been deleted.");
  } else {
    console.log("No classes found");
  }
}

export default deleteClassesByTournamentId;
