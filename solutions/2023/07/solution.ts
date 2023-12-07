import { countBy, identity, zip } from 'ramda';
import { readFile } from '~utils/core';

type Hand = {
  cards: string[];
  bid: number;
  cardValues?: number[];
};

type Input = Hand[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile).map((line) => ({
    cards: line.split(' ')[0].split(''),
    bid: Number(line.split(' ')[1]),
  }));
}

function cardValueGetter(cardValues: Record<string, number>) {
  return (card: string) => cardValues[card] || Number(card);
}

function compareHands(a: Hand, b: Hand, getCardValue: (card: string) => number): number {
  const aGroups = countBy(identity, Object.values(countBy(identity, a.cardValues)));
  const bGroups = countBy(identity, Object.values(countBy(identity, b.cardValues)));

  const typeDiff = ['5', '4', '3', '2'].find((type) => aGroups[type] !== bGroups[type]);
  if (typeDiff) {
    return (aGroups[typeDiff] || 0) - (bGroups[typeDiff] || 0);
  }

  const cardDiff = zip(a.cards, b.cards).find(([a, b]) => a !== b);
  return getCardValue(cardDiff[0]) - getCardValue(cardDiff[1]);
}

function getWinnings(hands: Hand[], getCardValue: (card: string) => number) {
  const sorted = hands.sort((a: Hand, b: Hand) => compareHands(a, b, getCardValue));
  return sorted.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);
}

// ---- Part A ----
export function partA(input: Input): number {
  const CARD_VALUES = { A: 14, K: 13, Q: 12, J: 11, T: 10 };
  const hands = input.map((hand) => ({
    ...hand,
    cardValues: hand.cards.map(cardValueGetter(CARD_VALUES)),
  }));

  return getWinnings(hands, cardValueGetter(CARD_VALUES));
}

function convertJoker(cardValues: number[]): number[] {
  let jokerCount = cardValues.filter((c) => c === 1).length;
  const nonJokers = cardValues.filter((c) => c !== 1);

  const nonJokerCounts = Object.entries(countBy(identity, nonJokers)).sort((a, b) =>
    b[1] !== a[1] ? b[1] - a[1] : Number(b[0]) - Number(a[0])
  );

  const jokersOptimalValue = Number(nonJokerCounts[0]?.[0]);

  return cardValues.map((card) => {
    if (card === 1 && jokerCount > 0) {
      jokerCount--;
      return jokersOptimalValue;
    }
    return card;
  });
}

// ---- Part B ----
export function partB(input: Input): number {
  const CARD_VALUES = { A: 14, K: 13, Q: 12, J: 1, T: 10 };

  const hands = input.map((hand) => ({
    ...hand,
    cardValues: convertJoker(hand.cards.map(cardValueGetter(CARD_VALUES))),
  }));

  return getWinnings(hands, cardValueGetter(CARD_VALUES));
}
