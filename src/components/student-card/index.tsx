import React = require("react");
import "./index.scss";
import { User, FileText, Trash, Edit } from "react-feather";
import { StudentModel } from "../../reducers/student/student-model";
import * as History from "history";
import { NoteController } from "../../reducers/note";
import { StudentController } from "../../reducers/student";

interface State {}

interface Props {
  data: StudentModel;
  reduxDispatch: any;
  location: History.Location;
  history: History.History;
}

export class StudentCard extends React.Component<Props, State> {
  state: State = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className={"student-card"}>
        <div className="user-image">
          <User />
        </div>
        <div className="info">
          <div className="row">
            <span className="label"> Name:</span> {`${this.props.data.first_name}  ${this.props.data.last_name}`}
          </div>
          <div className="row">
            <span className="label"> Age:</span> {this.props.data.age}
          </div>
          <div className="row">
            <span className="label"> City:</span> {this.props.data.city}
          </div>
          <div
            onClick={async () => {
              this.props.history.push(
                "edit-student/"+ this.props.data.id + this.props.location.search
              );
            }}
            className="edit"
          >
            <Edit />
          </div>
          <div
            onClick={async () => {
              const shouldDelete = confirm("Are you sure. you want to delete!");
              if(shouldDelete) {
                this.props.reduxDispatch(StudentController.deleteStudentByindex(this.props.data.id))
              }
            }}
            className="delete"
          >
            <Trash />
          </div>
          <div
            onClick={async () => {
              try {
                this.props.reduxDispatch(
                  NoteController.setData({
                    note: this.props.data.note,
                    student: this.props.data,
                  })
                ); 
                this.props.history.push(
                  "note" + this.props.location.search
                );
              } catch {
                alert("Internal Error. Please try again.");
              }
            }}
            className="note"
          >
            <FileText />
          </div>
        </div>
      </div>
    );
  }
}