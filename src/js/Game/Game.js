import React, { useEffect, useState } from "react";
import uuid from "uuid";
import cardImages from "../../humans";
import Card from "../Card/Card";

function shuffleArray(array) {
	return array.sort(() => 0.5 - Math.random());
}

function generateCards(gameStage) {
	const cards = cardImages.map((imageURL, index) => ({
		id: index,
		imageURL: `static/images/final${gameStage}/` + imageURL,
		isFlipped: false,
		canFlip: true
	}));

	return shuffleArray(cards);
}

export default function Game({ fieldWidth = 3, fieldHeight = 6 }) {
	const [cards, setCards] = useState(generateCards(1));
	const [canFlip, setCanFlip] = useState(false);
	const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);
	const [score, setScore] = useState(0);
	const [gameStage, setgameStage] = useState(1);
	const [showStage, setshowStage] = useState(false);
	const [endGame, setendGame] = useState(false);

	function reset() {
		setScore(0);
		setFirstCard(null)
		setSecondCard(null)
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(
					() => {
						setCardIsFlipped(card.id, true);
					},
					index++ * 100
				);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 6000);
	}

	function passStage() {
		setshowStage(true);

		setTimeout(() => {
			setshowStage(false);
			setCards(generateCards(gameStage));

		}, 3000)
	}

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev =>
			prev.map(c => {
				if (c.id !== cardID) return c;
				return { ...c, isFlipped };
			})
		);
	}
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev =>
			prev.map(c => {
				if (c.id !== cardID) return c;
				return { ...c, canFlip };
			})
		);
	}

	// showcase
	useEffect(() => {
		reset();
	}, []);

	function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

	function onSuccessGuess() {
		console.log("suc");
		setScore(score + 1);
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, false);
		setCardIsFlipped(secondCard.id, false);
		resetFirstAndSecondCards();
	}
	function onFailureGuess() {
		console.log("fail");

		const firstCardID = firstCard.id;
		const secondCardID = secondCard.id;

		setTimeout(() => {
			setCardIsFlipped(firstCardID, true);
		}, 1000);
		setTimeout(() => {
			setCardIsFlipped(secondCardID, true);
		}, 1200);

		resetFirstAndSecondCards();
	}

	useEffect(() => {
		if (!firstCard || !secondCard) return;
		// console.log("1", firstCard.imageURL.substring(21, 23));
		// console.log("2", secondCard.imageURL.substring(21, 23));
		firstCard.imageURL.substring(21, 23) ===
			secondCard.imageURL.substring(21, 23)
			? onSuccessGuess()
			: onFailureGuess();
	}, [firstCard, secondCard]);

	useEffect(() => {
		console.log('level up');
		console.log(gameStage);
		reset();
		passStage();
	}, [gameStage])

	useEffect(() => {
		if (score === 3) {
			console.log('i know u win');
			if (gameStage < 3) {
				setgameStage(gameStage + 1);
			} else {
				setendGame();
			}
		}
	}, [score])

	function onCardClick(card) {
		if (!canFlip) return;
		if (!card.canFlip) return;

		if (
			(firstCard && card.id === firstCard.id) ||
			(secondCard && card.id === secondCard.id)
		)
			return;

		setCardIsFlipped(card.id, false);

		firstCard ? setSecondCard(card) : setFirstCard(card);
	}

	return (
		<>
			<h1>{`est gameStage = ${gameStage} ; gamescore = ${score}`}</h1>
			<div className="game container-md">
				{!showStage && <div className="cards-container">
					{gameStage <= 3 ?
						cards.map(card => (
							<Card
								onClick={() => onCardClick(card)}
								key={card.id}
								{...card}
							/>
						))
						:
						<div>end game</div>
					}
				</div>}
			</div>
			{showStage && <div className="game-stage">
				<h1>{`Stage ${gameStage}`}</h1>
			</div>}
		</>
	);
}
