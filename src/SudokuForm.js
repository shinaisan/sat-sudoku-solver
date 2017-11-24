import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
  Form,
  Panel,
  Alert,
  Button
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { range } from './solver';

const validate = (values, props) => {
  const n = props.sudoku.problem.size;
  const errors = {};
  for (var v in values) {
    const s = values[v];
    if ((typeof(s) !== 'undefined') && (s.length > 0)) {
      const errorMessage = 'Please enter a digit from 1 to 9.';
      if (/^\d+$/.test(s)) {
        const val = Number(s);
        if ((val < 1) || (val > n)) {
          errors[v] = errorMessage;
        }
      } else {
        errors[v] = errorMessage;
      }
    }
  }
  return errors
};

const cell = (fieldNames, i, j) => (
  <Field
    name={fieldNames(i, j)}
    component={({input, meta: {touched, error}}) => (
      <div>
        <input {...input} type="text" size={1} />
        {
          touched && error && (
            <span title={error} ><FontAwesome name="exclamation-circle" /></span>
          )
        }
      </div>
    )}
  />
);

const renderTable = (n, cellFunc) => {
  const m = Math.floor(Math.sqrt(n));
  return (
    <table>
      <tbody>
        {
          range(n).map((i) => (
            <tr key={i}>
              {
                range(n).map((j) => (
                  <td
                    key={j}
                    style={{
                      paddingTop: ((i % m === 0) ? '4px' : '0'),
                      paddingLeft: ((j % m ===0) ? '4px' : '0')
                    }}
                  >
                    { cellFunc(i, j) }
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

let SudokuForm = props => {
  const { handleSubmit, pristine, reset, submitting, sudoku } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <div>
        {
          sudoku.error
          ? <Alert bsStyle="danger">Found no solutions to your problem.</Alert>
          : ''
        }
        <Panel 
          header="Problem"
          style={{display: 'inline-block'}}
        >
          {
            renderTable(sudoku.problem.size, (i, j) => (
              cell(sudoku.problem.getVarName.bind(sudoku.problem, 0), i, j)
            ))
          }
        </Panel>
        <Panel
          header="Solution"
          style={{display: 'inline-block'}}
        >
          {
            renderTable(sudoku.problem.size, (i, j) => (
              <input
                type="text"
                readOnly
                size={1}
                value={
                  ((!!sudoku.solution)
                    ? sudoku.solution[i][j] + 1
                    : '')
                }
              />
            ))
          }
        </Panel>
      </div>
      <div>
        <Button type="submit" bsStyle="primary"
          disabled={submitting}>
          Solve
        </Button>
        <Button type="button" bsStyle="default"
          disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </Button>
      </div>
    </Form>
  );
};

SudokuForm = reduxForm({
  form: 'sudokuForm',
  validate
})(SudokuForm);

SudokuForm = connect(
  (state) => ({sudoku: state.sudoku})
)(SudokuForm);

export default SudokuForm;

