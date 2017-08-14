export function setDifference(a: any[], b: any[]) {
  return a.filter((x) => b.indexOf(x) < 0);
}
