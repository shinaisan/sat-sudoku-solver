import React from 'react';
import { connect } from 'react-redux';
import SudokuForm from './SudokuForm';
import { range } from './solver';

class SolverControl extends React.Component {

  handleSubmit(values) {
    const problem = this.props.sudoku.problem;
    const n = problem.size;
    const v = problem.getVarName.bind(problem, 0);
    const assumptions = range(n).reduce((vs, i) => (
      vs.concat(range(n).reduce((ws, j) => (
        values[v(i, j)]
        ? ws.concat([problem.getVarName(i, j, Number(values[v(i, j)]) - 1)])
        : ws
      ), []))
    ), []);
    const dispatch = this.props.dispatch;
    dispatch({
      type: 'SOLVER_START'
    });
    setTimeout(() => {
      const solution = problem.solve(assumptions);
      if (!solution) {
        dispatch({
          type: 'SOLVER_FAILED'
        });
        return;
      }
      const symbolTable = problem.getSymbolTable(solution);
      dispatch({
        type: 'SOLUTION_SET',
        solution: symbolTable
      });
    }, 0);
  }

  render() {
    const onSubmit = this.handleSubmit.bind(this);
    return (
      <div>
        <SudokuForm
          onSubmit={onSubmit}
          sudoku={this.props.sudoku}
        />
      </div>
    );
  }

}

SolverControl = connect(
  state => ({sudoku: state.sudoku})
)(SolverControl);

export default SolverControl;

