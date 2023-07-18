import axios from "axios";

export interface CepData {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ddd: string
}

export interface ErrorCep {
  erro: boolean
}

export default async function isCepValid(cep: string): Promise<CepData | ErrorCep> {

  const { data } = await axios.get<CepData | ErrorCep>(`https://viacep.com.br/ws/${cep}/json/`);
  return data;
}
