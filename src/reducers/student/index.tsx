import { Switch } from "react-router-dom";
import { StudentModel } from "./student-model";

export const StudentAxtionTypes = {
  Set: "Categories_Set",
  Ft_Data: "Filtered_Data_Action",
  Ft_Sreach_Data: "Ft_Sreach_Data",
  load_data_storage_list: "Filtered_Data_Action",
  search_completed: "search_completed",
  searching: "searching",
  deleteStudentByindex: "deleteStudentByindex",
};

export type StudentState = {
  list?: StudentModel[];
  filteredlist?: StudentModel[]; 
  searchedlist?: StudentModel[]; 
  searchText: string; 
};

const localStorageList: string = localStorage.getItem('StudentList') || '';

export class StudentController {
  
  static value: StudentState = {
    list: localStorageList ? JSON.parse(localStorageList) || [] : [
      {
        first_name: 'John',
        last_name: 'Winter',
        id: 1,
        age: 32,
        city: 'Texas',
        note: 'Some of John\'s notes',
        index: 1,
      },
      {
        first_name: 'James',
        last_name: 'Dino',
        id: 2,
        age: 44,
        city: 'Texas',
        note: 'Some of James\'s notes',
        index: 2,
      },
      {
        first_name: 'Ali',
        last_name: 'James',
        id: 3,
        age: 22,
        city: 'Texas',
        note: 'Some of Ali\'s notes',
        index: 3,
      },
      {
        first_name: 'Jessica',
        last_name: 'Marble',
        id: 4,
        age: 56,
        city: 'New York',
        note: 'Some of Jessica\'s notes',
        index: 4,
      },
      {
        first_name: 'Alia',
        last_name: 'Bhatt',
        id: 5,
        age: 21,
        city: 'Mumbai',
        note: 'Some of Alia\'s notes',
        index: 5,
      },
      {
        first_name: 'Bob',
        last_name: 'Smith',
        id: 6,
        age: 30,
        city: 'Londo',
        note: 'Some of Bob\'s notes',
        index: 6,
      },
      {
        first_name: 'Mark',
        last_name: 'Moniz',
        id: 7,
        age: 25,
        city: 'Florida',
        note: 'Some of Mark\'s notes',
        index: 7,
      }
    ] as StudentModel[],
    filteredlist: undefined,
    searchedlist: undefined,
    searchText: ''
  };

  static reducer(state = StudentController.value, action: any) {
    if (action && action.type === StudentAxtionTypes.Set) {
      if(action.localSave) {
        localStorage.setItem('StudentList', JSON.stringify(action.list))
      }
      state = {
        ...state,
        list: action.list,
      };
    }

    if (action && action.type === StudentAxtionTypes.Ft_Sreach_Data) {
      state = {
        ...state,
        searchedlist: action.searchedList,
      };
    } 
    
    if (action && action.type === StudentAxtionTypes.Ft_Data) {
      state = {
        ...state,
        filteredlist: action.filteredlist
      }
    }

    if (action && action.type === StudentAxtionTypes.deleteStudentByindex) {
      const currentList: StudentModel[] = state.list as StudentModel[]; 
      const list = currentList.filter((value) => {
        if(action.id === value.id) {
          return false
        } 
        return true;
      })
      localStorage.setItem('StudentList', JSON.stringify(list))
      state = {
        ...state,
        list,
      }
    }

    if (action && action.type === StudentAxtionTypes.search_completed) {
      state = {
        ...state,
        searchText: action.searchText
      }
    }
    return state;
  }

  static setData(list: StudentModel[], localSave: boolean = true) {
    return {
      type: StudentAxtionTypes.Set,
      list, 
      localSave,
    };
  }

  static setFilteredData(filteredlist: StudentModel[]) {
    return {
      type: StudentAxtionTypes.Ft_Data,
      filteredlist,
    };
  }
  
  static deleteStudentByindex(id: number) {
    return {
      type: StudentAxtionTypes.deleteStudentByindex,
      id,
    };
  }

  static setSearchedData(searchedList: StudentModel[]) {
    return {
      type: StudentAxtionTypes.Ft_Sreach_Data,
      searchedList,
    };
  }

  static setSearch(searchText: string) {
    return {
      type: StudentAxtionTypes.search_completed,
      searchText,
    };
  }
}
