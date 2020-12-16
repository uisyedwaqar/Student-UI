import * as React from "react";
import "./index.scss";
import { ReduxType } from "../../reducers";
import { connect } from "react-redux";
import { Pagination } from "../../components/pagination";
import { StudentCard } from "../../components/student-card";
import { StudentModel } from "../../reducers/student/student-model";
import { StudentController, StudentState } from "../../reducers/student";
import { Button } from "../../components/button";
import * as History from "history";

export type Props = {
  reduxDispatch: any;
  students: StudentState;
  location: History.Location;
  history: History.History;
};

export type State = {
  fetching: boolean;
  count: number;
  currentPage: number;
  searchValue: string;
};

class Home extends React.Component<Props, any> {
  state: State = {
    fetching: false,
    currentPage: 1,
    count: 0,
    searchValue:'',
  };

  constructor(props: any) {
    super(props);
    const query = new URLSearchParams(this.props.location.search);
    const page = query.get("page");
    if (!page) {
      this.props.history.push("/?page=1");
    } else {
      this.state.currentPage = parseInt(page);
    }
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    return {
      searchValue: nextProps.students.searchText,
    };
  }
  getBody() {
    const PaginationComponent = (<Pagination
    onChange={(newPageNumber) => {
      this.props.history.push("?page=" + newPageNumber);
      this.setState(
        {
          currentPage: newPageNumber,
        },
        () => {
          this.loadstudents();
        }
      );
    }}
    currentPage={this.state.currentPage}
    pageSize={6}
    count={this.state.count}
  />)

  const pageSize = this.getDataLength();

  const NoData = ( <div className="header" style={{textAlign: 'center'}} >No data</div>);
    return (
      <div className={"web3"}>
        <div className="address">Student Smart Contracts</div>
        {this.props.students.filteredlist && (
          <div className="students">
            <div className="header">
              List of students
              <div style={{display:'flex', float:'right'}}>
                <div className="search">
                <div>
                    <input
                      value={this.state.searchValue}
                      placeholder={'Search'}
                      onChange={(e) => {
                        this.props.reduxDispatch(StudentController.setSearch(e.target.value))
                      }}
                      className={"textbox"}
                    /> 
                  </div> 
                </div>  
                <Button
                    text={"Add student"}
                    onClick={() => {
                      this.props.history.push(
                        "add-student" + this.props.location.search
                      );
                    }}
                  />
              </div>
            </div>
            <div className="list">
              {this.props.students.filteredlist &&
                this.props.students.filteredlist.map((data, index) => {
                  return (
                    <StudentCard
                      history={this.props.history}
                      location={this.props.location}
                      reduxDispatch={this.props.reduxDispatch}
                      data={data}
                      key={data.id.toString()}
                    />
                  );
                })}
            </div>
            {pageSize && pageSize > 0 ? null : NoData}
            {pageSize && pageSize > 0 ? PaginationComponent : null}
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.getBody();
  }

  loadstudents() {
    const cardSize = 6;
    const from = (this.state.currentPage - 1) * cardSize;
    const to = from + cardSize > this.state.count ? this.state.count: from + cardSize;
    const list: StudentModel[] = [];
    const studentList: StudentModel[] = this.props.students.searchText ? this.props.students.searchedlist || [] : this.props.students.list || [];
    for (let index = from; index < to; index++) {
      if(studentList) {
        list.push(studentList[index]);
      }
    }
    this.props.reduxDispatch(StudentController.setFilteredData(list));
  }

  getDataLength() {
    if(this.props.students.searchText) {
      return this.props.students.searchedlist?.length;
    }
    if(this.props.students.list) {
      return this.props.students.list.length;
    }
    return 0;
  }
  
  async loadLib() {
    const count = await this.getDataLength();
    this.setState({
      count,
    });
    this.loadstudents();
  }

  componentDidUpdate(preProps: any, preState: any) {
    if(this.props.students.list && preProps.students.list) {
      if(this.props.students.list.length !== preProps.students.list.length) {
        this.loadData();
      }
    }

    if(this.state.searchValue !==  preState.searchValue) {
      this.setState({
        currentPage: 1,
      })
      this.props.history.push("/?page=1" );
      this.loadData();
    }
  }

  async loadData() {
    const searchText = this.props.students.searchText.toLocaleLowerCase();
    if(this.props.students.searchText) {
      let sreachedList: StudentModel[] = [];
      sreachedList = this.props.students.list ? this.props.students.list.filter((student, index) =>  {
        const fname  = student.first_name.toLocaleLowerCase();
        const lname  = student.last_name.toLocaleLowerCase();
        if(fname.indexOf(searchText) >= 0 || lname.indexOf(searchText) >= 0) {
          return true
        } 
     
        return false;
      }) : [];

     
      await this.props.reduxDispatch(StudentController.setSearchedData(sreachedList));
      await this.loadLib();
    } else {
      await this.loadLib();
    }
    
  }

  async componentDidMount() {
   await this.loadData();
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
