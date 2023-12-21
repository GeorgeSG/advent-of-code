import { flatten, sum } from 'ramda';
import { readFileRaw } from '~utils/core';

type StepFn = (part: Part) => false | string;

type DefaultStep = { type: 'default' };
type MatcherStep = { type: 'matcher'; subject: string; operator: '>' | '<'; value: number };
type WorkflowStep = { fn: StepFn; destination: string } & (DefaultStep | MatcherStep);

type Workflow = { name: string; steps: WorkflowStep[] };

type Part = { x: number; m: number; a: number; s: number };

type Input = {
  workflows: Record<string, Workflow>;
  parts: Part[];
};

// Parser
export function prepareInput(inputFile: string): Input {
  const input = readFileRaw(inputFile);
  const [workflowsRaw, partsRaw] = input.split('\n\n');

  const workflows = workflowsRaw.split('\n').reduce((wf, line) => {
    const [name, rest] = line.split('{');
    const steps = rest.slice(0, -1).split(',');

    const parsedSteps = steps.map((step, i) => {
      if (i < steps.length - 1) {
        const [, subject, operator, value, _, destination] = step.match(/(\w)(>|<)(\w+)(:)(\w+)/);

        const fn = (part: Part) => {
          switch (operator) {
            case '>':
              return part[subject] > value ? destination : false;
            case '<':
              return part[subject] < value ? destination : false;
          }
        };

        return { type: 'matcher', subject, operator, value, destination, fn };
      }
      return { type: 'default', destination: step, fn: (_: Part) => step };
    });

    wf[name] = { name, steps: parsedSteps };
    return wf;
  }, {});

  const parts = partsRaw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [, x, m, a, s] = line.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/).map(Number);
      return { x, m, a, s };
    });

  return { workflows, parts };
}

function isAccepted(part: Part, workflows: Record<string, Workflow>): boolean {
  let currentWorkflow = workflows['in'];

  while (true) {
    const passingStep = currentWorkflow.steps.find((step) => step.fn(part) !== false);
    const nextWorkflow = passingStep.fn(part) as string;
    if (nextWorkflow === 'R') {
      return false;
    }
    if (nextWorkflow === 'A') {
      return true;
    }
    currentWorkflow = workflows[nextWorkflow];
  }
}

// ---- Part A ----
export function partA(input: Input): number {
  const accepted = input.parts.filter((part) => isAccepted(part, input.workflows));
  return sum(accepted.map(({ x, m, a, s }) => x + m + a + s));
}

// ---- Part B ----
export function partB(input: Input): number {
  const lowerLimits = { x: 0, m: 0, a: 0, s: 0 };
  const upperLimits = { x: 4000, m: 4000, a: 4000, s: 4000 };

  const findPaths = (current: string, workflows: Workflow[], path: string[]) => {
    if (current === 'in') {
      return path;
    } else {
      const prevs = workflows.filter((wf) => wf.steps.some((step) => step.destination === current));
      return prevs.map((wf) => findPaths(wf.name, workflows, [...path, wf.name]));
    }
  };

  const As = Object.values(input.workflows).filter((wf) =>
    wf.steps.some((step) => step.destination === 'A')
  );

  const aPaths = As.map((wf) =>
    flatten(findPaths(wf.name, Object.values(input.workflows), [wf.name])).reverse()
  );

  console.log(aPaths[0]);
  console.log(
    aPaths[0].map((step) => {
      const limits = [];
      input.workflows[step].steps.forEach((step) => {
        if (step.type === 'matcher') {
          if (step.destination === 'A') {
            limits.push({ subject: step.subject, value: step.value, operator: step.operator });
          } else {
            limits.push({
              subject: step.subject,
              value: step.value,
              operator: step.operator === '>' ? '<' : '>',
            });
          }
        }
      });
      return limits;
    })
  );

  console.log(JSON.stringify(aPaths));

  // const Arules = As.map((workflow) => {
  //   const limits = [];
  //   workflow.steps.forEach((step) => {
  //     if (step.type === 'matcher') {
  //       if (step.destination === 'A') {
  //         limits.push({ subject: step.subject, value: step.value, operator: step.operator });
  //       } else {
  //         limits.push({
  //           subject: step.subject,
  //           value: step.value,
  //           operator: step.operator === '>' ? '<' : '>',
  //         });
  //       }
  //     }
  //   });

  //   return { [workflow.name]: limits };
  // });
  // console.log(JSON.stringify(Arules));

  return 0;
}
