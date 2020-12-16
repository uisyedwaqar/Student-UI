import { combineReducers, createStore } from "redux";
import { StudentController, StudentState } from "./student";
import { NoteController, NoteState } from "./note";

export type ReduxType = {
  students: StudentState;
  note: NoteState;
};

type SyncReduxType = {
  [P in keyof ReduxType]: (
    state: Pick<ReduxType, P> | any,
    action: any
  ) => Pick<ReduxType, P> | any;
};

const reduxObj: SyncReduxType = {
  students: StudentController.reducer,
  note: NoteController.reducer
};

const reducer = combineReducers(reduxObj);

export const appStore = createStore(reducer);
