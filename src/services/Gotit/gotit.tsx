import AsyncStorage from "@react-native-community/async-storage";
import { BASE_URI } from "../Auth/uri";

interface Props {
  userID: string;
  note: string;
  token: string;
}

export const createGotitNotes = async ({ note, userID, token }: Props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/gotIt/notes/create/${userID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note, userId: userID }),
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in creating gotit note ", error);
      reject({ error: error.message });
    }
  });
};
export const createMultipleGotitNotes = async ({
  notes,
  userID,
  token,
}: {
  notes: Array<any>;
  userID: string;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/gotIt/create_notes/create/${userID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in creating gotit note ", error);
      reject({ error: error.message });
    }
  });
};
//remove it
export const copyNotesToNeedIt = async ({
  notesID,
  notes,
  userID,
  token,
}: {
  notesID: Array<string>;
  userID: string;
  token: string;
  notes: Array<any>;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/gotIt/copy_to_needIt/${userID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notesID, notes }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error copying to needIt note ", error);
      reject({ error: error.message });
    }
  });
};
export const getAllGotItNotes = async ({
  userID,
  token,
}: {
  userID: string;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/gotIt/notes/${userID}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in getting user notes ", error);
      reject({ error: error.message });
    }
  });
};
export const updateGotItNotes = async ({
  userID,
  noteID,
  token,
  note,
}: {
  userID: string;
  noteID: string;
  token: string;
  note: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/gotIt/notes/update/${noteID}/${userID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in updating gotit user notes ", error);
      reject({ error: error.message });
    }
  });
};
export const deleteGotItNotes = async ({
  userID,
  notesId,
  token,
}: {
  userID: string;
  notesId: Array<any>;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/gotIt/notes/delete/${userID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notesId, usedId: userID }),
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in deleting gotit user notes ", error);
      reject({ error: error.message });
    }
  });
};
export const markGotItNotesLow = async ({
  userID,
  notesID,
  token,
}: {
  userID: string;
  notesID: Array<string>;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/gotIt/notes/mark/${userID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notesID }),
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in marking gotit user notes as low", error);
      reject({ error: error.message });
    }
  });
};

export const markGotItNotesNotLow = async ({
  userID,
  notesID,
  token,
}: {
  userID: string;
  notesID: Array<string>;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/gotit/notes/mark_not_low/${userID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notesID }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in marking needit user notes as low", error);
      reject({ error: error.message });
    }
  });
};

export const moveToNeedIt = async ({
  userID,
  notesID,
  token,
}: {
  userID: string;
  notesID: Array<any>;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/gotit/notes/move_to_need_it/${userID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notesID }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in moving gotIt notes to needIt notes ", error);
      reject({ error: error.message });
    }
  });
};

//global
export const saveUserNotesToDb = async ({
  userID,
  token,
  notes,
}: {
  userID: string;
  token: string;
  notes: Array<object>;
}) => {
  new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/notes/create_multiple/${userID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notes),
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        await AsyncStorage.removeItem("userNotes");
        resolve("success");
      }
    } catch (error) {
      reject(error.message);
      console.log(error);
    }
  });
};
