// chessdiagram.js : defines Chess Diagram Component

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Board from './board.js';
import Piece from './piece.js';

class Chessdiagram extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedSquare: null,
			selectedPieceType: null,
			dragX: 0,
			dragY: 0,
			isDragging: false,
			left: 0,
			top: 0,
			width: 0,
			height: 0,
		};
	}

	// Lifecycle events ////

	componentDidMount() {
		this._getClientPos();
		addEventListener('resize', this._onResize.bind(this)); // resize event not provided by React; use DOM version
	}

	componentWillUnmount() {
		removeEventListener('resize', this._onResize.bind(this));
	}

	// event handling ////

	_onResize(evt) { // (DOM event)
		this._getClientPos();
	}

	_onMouseDown(evt) {
		evt.preventDefault();
		let x = evt.clientX - this.state.left;
		let y = evt.clientY - this.state.top;
		this._grab(x,y);
	}

	_onTouchStart(evt) {
		evt.preventDefault();
		let x = evt.touches[0].clientX - this.state.left;
		let y = evt.touches[0].clientY - this.state.top;
		this._grab(x,y);
	}

	_onMouseMove(evt) {
		evt.preventDefault();
		let x = evt.clientX - this.state.left;
		let y = evt.clientY - this.state.top;
		this._move(x,y);
	}

	_onTouchMove(evt) {
			evt.preventDefault();
	let x = evt.touches[0].clientX - this.state.left;
		let y = evt.touches[0].clientY - this.state.top;
		this._move(x,y);
	}

	_onMouseUp(evt) {
		evt.preventDefault();
		this._release();
	}
	_onTouchEnd(evt) {
		evt.preventDefault();
		this._release();
	}

	// private actions

	_grab(x,y) {
	
		console.log(x,y);
		let boardW = this.props.squareSize * (1+this.props.files);
		let boardH = this.props.squareSize * (this.props.ranks);
		
		if(x < this.props.squareSize || x > boardW || y < 0 || y > boardH) {
			//outside the board ...
			return false;
		}

		let file = String.fromCharCode(97 + x / this.props.squareSize - 1);
		let rank = 1 + Math.floor((this.props.ranks * this.props.squareSize - y) / this.props.squareSize);
		let selectedSquare = file + rank;
		let selectedPiece = this._getPieceAtSquare(selectedSquare);

		this.setState({
			selectedSquare: selectedSquare,
			selectedPieceType: selectedPiece ? selectedPiece.pieceType : null,
			dragX: selectedPiece ? selectedPiece.x + this.props.squareSize / 2: this.state.dragX,
			dragY: selectedPiece ? selectedPiece.y + this.props.squareSize / 2: this.state.dragY,
			isDragging: true
		});
	}

	_move(x, y) {
		if(this.state.isDragging){
			this.setState({dragX: x, dragY: y});
		}
	}

	_release() {
		this.setState({isDragging: false});
	}

	// self-enquiry ////

	_getClientPos() {
		let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
		this.setState({left: rect.left, top: rect.top, width: rect.width, height: rect.height});
	}

	_getPieces() {
		return this.props.pieces.map((pieceString,i) => {
			let [pieceType, square ] = pieceString.split('@',2);	// split 'piece@square' into pieceType, square
			if(!square)
				return {pieceType: 'invalid', square: 'none', x: 0,y: 0}; // guard against nonsense input
			let x = this.props.squareSize * (1 + square.toLowerCase().charCodeAt(0)-97);
			let y = (this.props.ranks-Number(square.slice(1))) * this.props.squareSize;
			if (isNaN(y))
				return {pieceType: 'invalid', square: 'none', x: 0,y: 0}; // invalid y-coordinate
			return {pieceType: pieceType, square: square.toLowerCase(), x: x, y: y};
		});
	}

	_getPieceAtSquare(square) {
		return this._getPieces().filter(pieceLocation => pieceLocation.square === square)[0];
	}

	// render function

	render() {
		return (
				<svg 
					width={this.props.width === "auto" ? (1 + this.props.files) * this.props.squareSize : this.props.width}
					height={this.props.height === "auto" ? (1 + this.props.ranks) * this.props.squareSize : this.props.height}
					onMouseDown={this._onMouseDown.bind(this)}
					onTouchStart={this._onTouchStart.bind(this)}
					onMouseMove={this._onMouseMove.bind(this)}
					onTouchMove={this._onTouchMove.bind(this)}
					onMouseUp={this._onMouseUp.bind(this)}
					onTouchEnd={this._onTouchEnd.bind(this)}	
				>
					
					<Board 
						squareSize={this.props.squareSize} ranks={this.props.ranks} files={this.props.files} selectedSquare={this.state.selectedSquare}
						lightSquareColor={this.props.lightSquareColor} darkSquareColor={this.props.darkSquareColor}
					/>
					
					{this._getPieces().map((piece, i) => 
						<Piece 
							x={this.state.isDragging && piece.square === this.state.selectedSquare ? this.state.dragX - this.props.squareSize / 2 : piece.x}
							y={this.state.isDragging && piece.square === this.state.selectedSquare ? this.state.dragY - this.props.squareSize / 2 : piece.y} 
							key={i} pieceType={piece.pieceType} squareSize={this.props.squareSize} 
						/>
					)}
				</svg>
		);
	}
}

Chessdiagram.propTypes = {
	squareSize: React.PropTypes.number,
	ranks: React.PropTypes.number,
	files: React.PropTypes.number,
	lightSquareColor: React.PropTypes.string,
	darkSquareColor: React.PropTypes.string,
}

Chessdiagram.defaultProps = {
	width: 'auto',
	height: 'auto',
	squareSize: 45,
	ranks: 8,
	files: 8,
	lightSquareColor: "#2492FF",
	darkSquareColor:  "#005EBB",
}

export default Chessdiagram;