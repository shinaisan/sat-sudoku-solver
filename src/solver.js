const Logic = require('logic-solver');

/* The range function generates an array containing integers
 * ranging from zero to n-1.
 * This is often used in this module to iterate a block of code n times.
 * */
function range(n) {
  return Array(n).fill().map((x, i) => (i));
}

/* The genVars function generates variable names
 * each of which is indexed by a triple (r, c, s)
 * where r, c and s each indicates a row index, a column index
 * and a symbol respectively.
 * An index has the dimension of size x size x size.
 * A pair (r, c) specifies a cell in a Latin square.
 * Only one variable for each cell can have a true value.
 * A set of (r, c, s) triples for all the true variables
 * is the orthogonal array representation of a Latin square.
 * */
function genVars(prefix, size) {
  return range(size).map((i) => (
    range(size).map((j) => (
      range(size).map((k) => (
        [prefix, i.toString(), j.toString(), k.toString()].join('_')
      ))
    ))
  ));
}

/* A Latin square is an n x n array filled with n different symbols.
 * Each symbol must occur exactly once in each row.
 * Each symbol must occur exactly once in each column.
 * Each cell of a square must have exactly one symbol.
 * The function latinSquare constructs a logical formula
 * expressing the conjunction of the above logical conditions.
 * */
function latinSquare(solver, vars) {
  const n = vars.length;
  range(n).forEach((i) => {
    range(n).forEach((j) => {
      solver.require(Logic.exactlyOne(range(n).map((k) => (vars[k][i][j]))));
      solver.require(Logic.exactlyOne(range(n).map((k) => (vars[i][k][j]))));
      solver.require(Logic.exactlyOne(range(n).map((k) => (vars[i][j][k]))));
    });
  });
}

function sudoku(solver, vars) {
  const n = vars.length;
  const m = Math.floor(Math.sqrt(n));
  latinSquare(solver, vars);
  range(m).forEach((i) => {
    range(m).forEach((j) => {
      range(n).forEach((k) => {
        solver.require(Logic.exactlyOne(
          range(n).map((l) => (
            vars[m*i + Math.floor(l/m)][m*j + (l%m)][k]
          ))));
      });
    });
  });
}

class Sudoku {

  constructor(n) {
    this.size = n;
    this.vars = genVars('v', n);
  }

  getVarName(i, j, k) {
    return this.vars[i][j][k];
  }

  solve(assumptions) {
    const solver = new Logic.Solver();
    sudoku(solver, this.vars);
    if (!!assumptions) {
      return solver.solveAssuming(Logic.and(assumptions));
    } else {
      return solver.solve();
    }
  }

  getSymbolTable(solution) {
    const n = this.size;
    const vs = this.vars;
    const m = solution.getMap();
    return range(n).map((i) => (
      range(n).map((j) => (
        vs[i][j].indexOf(vs[i][j].find((v) => (m[v])))
      ))
    ));
  }

  /* The OAR function generates an orthogonal array representation of
   * a solution to a problem.
   * */
  OAR(solution) {
    const n = this.size;
    const vs = this.vars;
    const m = solution.getMap();
    return range(n).reduce((oar, i) => (
      oar.concat(
        range(n).reduce((row, j) => (
          row.concat([[i, j, vs[i][j].indexOf(vs[i][j].find((v) => (m[v])))]])
        ), [])
      )
    ), []);
  }

}

module.exports = { range, Sudoku };

