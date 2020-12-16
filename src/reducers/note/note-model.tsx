import { StudentModel } from "../student/student-model";

export type NoteModel = {
  note: string;
  student: StudentModel;
};
