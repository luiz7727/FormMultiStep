export function isAdult(userDate: string): boolean {

  //formato da data que é retornado: 2023-07-11
  const yearData: number = Number(userDate.slice(0, 4));
  const data: number = new Date().getFullYear();

  return data - yearData >= 18;
}

