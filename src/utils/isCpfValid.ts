export function isCpfValid(cpf: string): boolean {
  cpf = removeSpecialCaractersFromCpf(cpf);

  if (
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999' ||
    cpf.length !== 11
  ) {
    return false;
  }

  let dig10, dig11;
  let sm = 0;
  let peso = 10;

  for (let i = 0; i < 9; i++) {
    const num = parseInt(cpf.charAt(i), 10);
    sm += num * peso;
    peso--;
  }

  let r = 11 - (sm % 11);
  dig10 = r === 10 || r === 11 ? '0' : String.fromCharCode(r + 48);

  sm = 0;
  peso = 11;
  for (let i = 0; i < 10; i++) {
    const num = parseInt(cpf.charAt(i), 10);
    sm += num * peso;
    peso--;
  }

  r = 11 - (sm % 11);
  dig11 = r === 10 || r === 11 ? '0' : String.fromCharCode(r + 48);

  return dig10 === cpf.charAt(9) && dig11 === cpf.charAt(10);
}

function removeSpecialCaractersFromCpf(cpf: string): string {
  if (cpf.includes(".")) {
    cpf = cpf.replace(/\./g, "");
  }

  if (cpf.includes("-")) {
    cpf = cpf.replace(/-/g, "");
  }

  if (cpf.includes("/")) {
    cpf = cpf.replace(/\//g, "");
  }

  return cpf;
}

