import React from 'react';
import {
  Navbar,
  // Form,
  // FormControl,
  // Button
} from 'react-bootstrap';

const title = 'Sudoku Solver';

class TopNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Navbar fixedTop={true} inverse={true}>
        <Navbar.Header>
          <Navbar.Brand>{title}</Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    )
  }
}

export default TopNavbar;

