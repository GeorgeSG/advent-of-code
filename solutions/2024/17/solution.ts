import { o, splitEvery } from 'ramda';
import { readFile } from '~utils/core';

type Instruction = { opcode: number; operand: number };
type Registers = { a: number; b: number; c: number };

type Input = {
  registers: Registers;
  instructions: Instruction[];
};

function parseRegisterValue(value: string): number {
  return Number(value.split(': ')[1]);
}

// Parser
export function prepareInput(inputFile: string): Input {
  const input = readFile(inputFile);

  const registers = {
    a: parseRegisterValue(input[0]),
    b: parseRegisterValue(input[1]),
    c: parseRegisterValue(input[2]),
  };
  const instructions = splitEvery(2)(input[input.length - 1].split('Program: ')[1].split(',')).map(
    ([opcode, operand]) => ({ opcode: Number(opcode), operand: Number(operand) })
  );

  return { registers, instructions };
}

function getComboOperand(registers: Registers, operand: number): number {
  if (operand < 4) {
    return operand;
  }
  if (operand === 4) {
    return registers.a;
  }

  if (operand === 5) {
    return registers.b;
  }

  if (operand === 6) {
    return registers.c;
  }

  throw new Error('Invalid combo operand 7');
}

// ---- Part A ----
export function partA({ registers, instructions }: Input): string {
  let currentInstruction = 0;
  let output = [];

  console.log(instructions);

  while (currentInstruction < instructions.length) {
    const { opcode, operand } = instructions[currentInstruction];
    switch (opcode) {
      case 0:
        console.log(
          'adv',
          registers.a,
          getComboOperand(registers, operand),
          Math.floor(registers.a / Math.pow(2, getComboOperand(registers, operand)))
        );
        registers.a = Math.floor(registers.a / Math.pow(2, getComboOperand(registers, operand)));
        break;
      case 1:
        registers.b = registers.b ^ operand;
        break;
      case 2:
        registers.b = getComboOperand(registers, operand) % 8;
        break;
      case 3:
        if (registers.a !== 0) {
          currentInstruction = operand;
          continue;
        }
      case 4:
        registers.b = registers.b ^ registers.c;
        break;
      case 5:
        output.push(getComboOperand(registers, operand) % 8);
        break;
      case 6:
        registers.b = Math.floor(registers.a / Math.pow(2, getComboOperand(registers, operand)));
        break;
      case 7:
        registers.c = Math.floor(registers.a / Math.pow(2, getComboOperand(registers, operand)));
        break;
    }

    console.log(currentInstruction, registers);
    currentInstruction += 1;
  }

  return output.join(',');
}

// ---- Part B ----
export function partB(input: Input): number {
  return 0;
}
