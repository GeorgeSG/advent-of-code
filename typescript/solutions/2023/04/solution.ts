import { parse } from 'path';
import { F, sum, times } from 'ramda';
import { readFile } from '~utils/core';

type Card = {
  winning: number[];
  attempted: number[];
};

type Input = Card[];

// Parser
export function prepareInput(inputFile: string): Input {
  return readFile(inputFile, (line) => {
    const numbers = line.split(': ')[1];
    const [winning, attempted] = numbers
      .split(' | ')
      .map((n) => n.split(' ').map(Number).filter(Boolean));

    return { winning, attempted };
  });
}

const getWinningNumbers = (card: Card) =>
  card.attempted.filter((n) => card.winning.includes(n)).length;

// ---- Part A ----
export function partA(input: Input): number {
  return input.reduce((result, card) => {
    const winning = getWinningNumbers(card);
    return winning > 0 ? result + Math.pow(2, winning - 1) : result;
  }, 0);
}

// ---- Part B ----
export function partB(cards: Input): number {
  const initialCardCounts = Array.from({ length: cards.length }, () => 1);

  const cardCounts = cards.reduce((cardCounts, card, cardIndex) => {
    times((i) => (cardCounts[cardIndex + i + 1] += cardCounts[cardIndex]), getWinningNumbers(card));
    return cardCounts;
  }, initialCardCounts);

  return sum(cardCounts);
}
