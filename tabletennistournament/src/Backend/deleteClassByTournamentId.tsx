import { db } from "./firebaseinit";
import { remove, ref } from "firebase/database";

async function deleteClass(classId: number): Promise<void> {
  const classRef = ref(db, `class/${classId}`);

  try {
    await remove(classRef);
    console.log(`Class deleted: ${classId}`);
  } catch (error) {
    console.error(`Error deleting class: ${classId}`, error);
  }
}

export default deleteClass;
