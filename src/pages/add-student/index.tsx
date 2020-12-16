import React = require("react");
import { connect } from "react-redux";
import { ReduxType } from "../../reducers";
import "./index.scss";
import { XCircle } from "react-feather";
import { Button } from "../../components/button";
import { StudentController, StudentState } from "../../reducers/student";
import * as History from "history";
import { StudentModel } from "../../reducers/student/student-model";
import { isThisTypeNode } from "typescript";

const RegExNum = /^[0-9\b]+$/;
const ADD = "ADD";
const EDIT = "EDIT";

interface State {
  first_name: string;
  last_name: string;
  age: string;
  city: string;
  note: string;
  error: {
    name?: string;
    age?: string;
    city?: string;
    note?: string;
  };
  show: boolean;
}

interface Props {
  location: History.Location;
  history: History.History;
  students: StudentState;
  reduxDispatch: any;
  action: string;
  match: any;
}

class AddStudent extends React.Component<Props, State> {
  state: State = {
    first_name: "",
    last_name: "",
    age: "",
    city: "",
    note: "",
    error: {},
    show: false,
  };

  constructor(props: any) {
    super(props);
    if (props.action === EDIT) {
      const id = +props.match.params.id;
      const studentData = props.students.list.find((value: StudentModel, index: number) => {
        return value.id === id;
      });

      this.state = {
        ...this.state,
        ...studentData,
      };
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true,
      });
    }, 10);
  }

  async submitForm() {
    this.state.error = {};
    let isFormValid = true;
    if (this.state.first_name.trim() === "") {
      this.state.error.name = "First name should not be empty.";
      isFormValid = false;
    }
    if (this.state.last_name.trim() === "") {
      this.state.error.name = "Last name should not be empty.";
      isFormValid = false;
    }
    if (this.state.age.toString().trim() === "") {
      this.state.error.age = "Age should not be empty.";
      isFormValid = false;
    }
    if (this.state.city.trim() === "") {
      this.state.error.city = "City should not be empty.";
      isFormValid = false;
    }
    if (this.state.note.trim() === "") {
      this.state.error.note = "Note should not be empty.";
      isFormValid = false;
    }

    this.setState({});
    if (isFormValid) {
      try {
        if (this.props.action === EDIT) {
          const studentList: StudentModel[] = this.props.students.list
            ? [...this.props.students.list]
            : [];
          const id = +this.props.match.params.id;
          const studentData = studentList.find((value, index) => {
            return value.id === id;
          });

          if (studentData) {
            studentData.first_name = this.state.first_name;
            studentData.last_name = this.state.last_name;
            studentData.age = +this.state.age;
            studentData.city = this.state.city;
            studentData.note = this.state.note;
            studentData.first_name = this.state.first_name;
          }

          await this.props.reduxDispatch(
            StudentController.setData(studentList)
          );
          this.props.history.push("/" + this.props.location.search);
          setTimeout(() => {
            alert(
              `Student updated successfully.`
            );
          });
        } else {
          const studentList: StudentModel[] = this.props.students.list
            ? [...this.props.students.list]
            : [];
          const studentsize: number = this.props.students.list
            ? this.props.students.list.length
            : 0;
          studentList.push({
            id: studentsize + 1,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            age: parseInt(this.state.age),
            city: this.state.city,
            note: this.state.note,
            index: studentsize + 1,
          });
          await this.props.reduxDispatch(
            StudentController.setData(studentList)
          );
          this.props.history.push("/" + this.props.location.search);
          setTimeout(() => {
            alert(
              `Student added successfully.`
            );
          });
        }
      } catch {
        alert("Failed to add Student. Please try again.");
      }
    }
  }

  getInput(data: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) {
    return (
      <div className={"row"}>
        <div className={"label"}>{data.label}</div>
        <input
          value={data.value}
          onChange={data.onChange}
          className={"textbox"}
        />
        {
          <div className={"error " + !!data.error}>
            {data.error ? data.error : "-"}
          </div>
        }
      </div>
    );
  }

  render() {
    const formTitile =
      this.props.action === EDIT ? "Edit Student" : "Add Student";
    return (
      <div className={"add-student" + (this.state.show ? " show" : "")}>
        <div className={"form"}>
          <div className={"header"}>
            {formTitile}
            <div
              onClick={() => {
                this.props.history.push("/" + this.props.location.search);
              }}
              className={"close"}
            >
              <XCircle />
            </div>
          </div>
          <div className={"body"}>
            {this.getInput({
              label: "First Name",
              value: this.state.first_name,
              error: this.state.error.name,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  first_name: value,
                });
              },
            })}
            {this.getInput({
              label: "Last Name",
              value: this.state.last_name,
              error: this.state.error.name,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  last_name: value,
                });
              },
            })}
            {this.getInput({
              label: "Age",
              value: this.state.age,
              error: this.state.error.age,
              onChange: (e) => {
                const value = e.target.value;
                if (value === "" || RegExNum.test(value)) {
                  const num = value ? parseInt(value) : 0;
                  if (num <= 150) {
                    this.setState({
                      age: num
                        ? num > 150
                          ? (150).toString()
                          : num.toString()
                        : "",
                    });
                  }
                }
              },
            })}
            {this.getInput({
              label: "City",
              value: this.state.city,
              error: this.state.error.city,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  city: value,
                });
              },
            })}
            {this.getInput({
              label: "Note",
              value: this.state.note,
              error: this.state.error.note,
              onChange: (e) => {
                const value = e.target.value;
                this.setState({
                  note: value,
                });
              },
            })}
          </div>
          <div className={"footer"}>
            <Button
              text={"Submit"}
              onClick={() => {
                this.submitForm();
              }}
              className={"submit"}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxType) => {
  return {
    students: state.students,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    reduxDispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddStudent);
