export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitFor(fn: () => boolean, ms: number = 10) {
  let result = false;
  await wait(ms);
  while (!result) {
    result = fn();
    if (!result) await wait(ms);
  }
}
