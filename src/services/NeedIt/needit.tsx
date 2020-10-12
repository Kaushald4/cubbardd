import { BASE_URI } from "../Auth/uri";

interface Props {
  userID: string;
  note: string;
  token: string;
}

export const createNeedItNotes = async ({ note, userID, token }: Props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/needIt/notes/create/${userID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note, userId: userID }),
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
export const getAllNeedItNotes = async ({
  userID,
  token,
}: {
  userID: string;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/needIt/notes/${userID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in getting user notes ", error);
      reject({ error: error.message });
    }
  });
};
export const updateNeedItNotes = async ({
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
        `${BASE_URI}/needIt/notes/update/${noteID}/${userID}`,
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
export const deleteNeedItNotes = async ({
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
      const response = await fetch(
        `${BASE_URI}/needIt/notes/delete/${userID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notesId, usedId: userID }),
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in deleting gotit user notes ", error);
      reject({ error: error.message });
    }
  });
};
export const markNeedItNotesLow = async ({
  userID,
  noteID,
  token,
}: {
  userID: string;
  noteID: string;
  token: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${BASE_URI}/needIt/notes/mark/${noteID}/${userID}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log("error in marking gotit user notes as low", error);
      reject({ error: error.message });
    }
  });
};
