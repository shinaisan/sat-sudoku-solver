import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Sudoku } from './solver';

const INITIAL_SUDOKU = {
  busy: false,
  problem: new Sudoku(9),
  solution: null,
  error: false
};
const sudoku = (state = INITIAL_SUDOKU, action) => {
  switch (action.type) {
    case 'SOLUTION_SET':
      return {
        ...state,
        busy: false,
        solution: action.solution,
        error: false
      };
    case 'SOLVER_START':
      return {
        ...state,
        busy: true,
        solution: null,
        error: false
      };
    case 'SOLVER_FAILED':
      return {
        ...state,
        busy: false,
        solution: null,
        error: true
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  form: formReducer,
  sudoku
});

export default rootReducer;

