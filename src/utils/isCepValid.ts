import axios from "axios";

export interface CepData {
  state: string,
  city: string,
  address: string,
  status: number
}

export interface ErrorCep {
  code: string,
  status: number
}

export default async function isCepValid(cep: string) {

  try {
    const { data } = await axios.get<CepData>(`https://cdn.apicep.com/file/apicep/${cep}.json`);
    return data;
  }
  catch (e) {
    const data: ErrorCep = {
      code: "NOT_FOUND",
      status: 404
    }
    return data
  }

}
