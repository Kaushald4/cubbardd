export { default as skipAuth } from "./Auth/skipAuth";
export { loginWithEmailAndPassword } from "./Auth/login";
export { logInWithFacebook, signupWithFacebook } from "./Auth/facebookAuth";
export {
  createGotitNotes,
  deleteGotItNotes,
  getAllGotItNotes,
  markGotItNotesLow,
  updateGotItNotes,
} from "./Gotit/gotit";
export {
  createNeedItNotes,
  markNeedItNotesLow,
  deleteNeedItNotes,
  getAllNeedItNotes,
  updateNeedItNotes,
} from "./NeedIt/needit";

export { signout } from "./Auth/signout";
