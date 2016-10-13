import React, { Component } from 'react';
import Chessdiagram from './chessdiagram.js';

import './App.css';

// import processCSS from './cssconsolidate.js';
// processCSS();

class App extends Component {
  render() {

		const pieces = ['suck it','q@C4'];		
		const pieces2=[
			'R@a1',
			'N@b1',
			'B@c1',
			'Q@d1',
			'K@e1',
			'B@f1',
			'N@g1',
			'R@h1',

			'P@a2',
			'P@b2',
			'P@c2',
			'P@d2',
			'P@e2',
			'P@f2',
			'P@g2',
			'P@h2',

			'p@a7',
			'p@b7',
			'p@c7',
			'p@d7',
			'p@e7',
			'p@f7',
			'p@g7',
			'p@h7',

			'r@a8',
			'n@b8',
			'b@c8',
			'q@d8',
			'k@e8',
			'b@f8',
			'n@g8',
			'r@h8',
			
		];

    return (
			<div>
			<p> chess ! </p>
			<Chessdiagram pieces={pieces2} squareSize={60}/>
			
			</div>
    );
  }
}

export default App;

// <Chessdiagram pieces={pieces} squareSize={34}/>