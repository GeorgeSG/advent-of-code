import { RunType } from 'cli/lib/solutionRunner';
import { get } from 'http';
import { clone, range } from 'ramda';
import { readFile } from '~utils/core';
import { arrayLcm } from '~utils/numbers';

type Pulse = 'low' | 'high';

type RegularModule = {
  name: string;
  dest: string[];
};

type ConjunctionModule = {
  type: '&';
  state: Record<string, Pulse>;
} & RegularModule;

type FlipFlopModule = {
  type: '%';
  state: boolean;
} & RegularModule;

type Module = (RegularModule & { type: '' }) | ConjunctionModule | FlipFlopModule;

type Input = Record<string, Module>;

// Parser
export function prepareInput(inputFile: string): Input {
  const modules: Record<string, Module> = {};
  readFile(inputFile, (line) => {
    let [name, destinations] = line.split(' -> ');
    let type: '%' | '&';
    let state;
    if (name.startsWith('&')) {
      type = '&';
      name = name.slice(1);
      state = {};
    } else if (name.startsWith('%')) {
      type = '%';
      name = name.slice(1);
      state = false;
    }
    modules[name] = { name, dest: destinations.split(', '), type, state };
  });

  Object.values(modules).forEach((module) => {
    module.dest.forEach((dest) => {
      if (modules[dest]?.type === '&') {
        (modules[dest] as ConjunctionModule).state[module.name] = 'low';
      }
    });
  });

  return modules;
}

function processPulse(pulse: Pulse, source: string, destinationModule: Module) {
  if (destinationModule?.type === '%' && pulse === 'low') {
    const newPulse: Pulse = destinationModule.state ? 'low' : 'high';
    destinationModule.state = !destinationModule.state;

    return destinationModule.dest.map((dest) => ({
      pulse: newPulse,
      source: destinationModule.name,
      dest,
    }));
  }

  if (destinationModule?.type === '&') {
    destinationModule.state[source] = pulse;

    const newPulse: Pulse = Object.values(destinationModule.state).some((p) => p === 'low')
      ? 'high'
      : 'low';

    return destinationModule.dest.map((dest) => ({
      pulse: newPulse,
      source: destinationModule.name,
      dest,
    }));
  }

  return [];
}

function getInitialPulses(input: Input): { pulse: Pulse; source: string; dest: string }[] {
  return input['broadcaster'].dest.map((dest) => ({ pulse: 'low', source: 'broadcaster', dest }));
}

function pressAndCount(input: Input) {
  let lowPulses = 1; // start from 1 for initial button push
  let highPulses = 0;

  let pulses = getInitialPulses(input);

  while (pulses.length > 0) {
    const { pulse, source, dest } = pulses.shift();
    if (pulse === 'high') {
      highPulses++;
    } else {
      lowPulses++;
    }
    pulses = pulses.concat(processPulse(pulse, source, input[dest]));
  }

  return { lowPulses, highPulses };
}

// ---- Part A ----
export function partA(input: Input): number {
  let low = 0;
  let high = 0;

  range(0, 1000).map(() => {
    const { lowPulses, highPulses } = pressAndCount(input);
    low += lowPulses;
    high += highPulses;
  });

  return low * high;
}

function pressUntilTargetHit(input: Input, target: { dest: string; pulse: Pulse }) {
  let pulses = getInitialPulses(input);

  while (pulses.length > 0) {
    const { pulse, source, dest } = pulses.shift();
    if (dest === target.dest && pulse === target.pulse) {
      return true;
    }
    pulses = pulses.concat(processPulse(pulse, source, input[dest]));
  }

  return false;
}

function countPressesTo(input: Input, target: string) {
  let buttonPresses = 1;
  while (!pressUntilTargetHit(input, { dest: target, pulse: 'low' })) {
    buttonPresses++;
  }
  return buttonPresses;
}

// ---- Part B ----
export function partB(input: Input, { runType }): number {
  if (runType !== RunType.REAL) {
    return NaN;
  }

  // 'cl', 'bm', 'tn', 'dr' signal to vr, which signals to rx
  const presses = ['cl', 'bm', 'tn', 'dr'].map((target) => countPressesTo(clone(input), target));
  return arrayLcm(presses);
}
