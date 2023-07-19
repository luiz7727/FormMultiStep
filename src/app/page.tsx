"use client"

import { useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import 'animate.css';
import { isCpfValid } from "@/utils/isCpfValid";
import { isAdult } from "@/utils/isAdult";
import isCepValid, { CepData } from "@/utils/isCepValid";

const mySchema = z.object({
  name: z.string().min(4, { message: "Name is required" }).nonempty({ message: "Nome é obrigatório" }),
  cpf: z.string().min(11, { message: "O cpf precisa ter no mínimo 11 números" }).max(11, { message: "O cpf precisa ter no máximo 11 números" })
    .nonempty({ message: "cpf é obrigatório" }).refine((cpf) => isCpfValid(cpf), { message: "CPF inválido" }),
  email: z.string().nonempty({ message: "O email é obrigatório" }),
  password: z.string().nonempty({ message: "A senha é obrigatória" }),
  telephone: z.string().nonempty({ message: "Telefone é obrigatório" }),
  bornDate: z.string().nonempty({ message: "Data de nascimento é obrigatório" }).refine((date) => isAdult(date), { message: "Voce precisa ser maior de idade" }),
  gender: z.string().min(4, { message: "O genero precisa ter no mínimo 4 caracteres" }).nonempty({ message: "O genero é obrigatório" }),
  ethnicity: z.string().nonempty({ message: "A raça é obrigatória" }),
  address: z.object({
    cep: z.string().nonempty({ message: "O cep é obrigatório" }).min(8, { message: "o cep precisa ter no mínimo 8 caracteres" }).max(9, { message: "o cep precisa ter no máximo 9 caracteres" }),
    nameStreet: z.string().nonempty({ message: "O nome da rua é obrigatório" }),
    numberStreet: z.coerce.number().nonnegative({ message: "O numero não pode ser negativo" }),
    state: z.string().nonempty({ message: "O estado é obrigatório" }),
    city: z.string().nonempty({ message: "A cidade é obrigatória" }),
    neighborhood: z.string().nonempty({ message: "O bairro é obrigatório" }),
    complement: z.string().optional()
  }),
  graduation: z.array(z.object({
    name: z.string().nonempty({ message: "O nome da graduação é obrigatório" }),
    dateStart: z.string().nonempty({ message: "A data de início é obrigatório" }),
    dateEnd: z.string().nonempty({ message: "A data de fim é obrigatório" }),
    isCollegePrivate: z.boolean().default(false),
    isSchoolPublic: z.boolean().default(false),
  })).min(1, "Insira pelo menos uma graduação"),
  acceptRegulation: z.boolean().default(false).refine((value) => value === true, { message: "Voce precisa aceitar os termos de privacidade" })
}).required();

type createUserFormData = z.infer<typeof mySchema>;

export default function Home() {

  const [step, setStep] = useState<number>(1);

  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const { control, clearErrors, register, watch, getValues, setError, handleSubmit, formState: { errors }, setValue } = useForm<createUserFormData>({
    resolver: zodResolver(mySchema),
    reValidateMode: "onChange",
    mode: "onChange"
  })

  const { fields, append, remove } = useFieldArray({ control, name: "graduation" })

  function validateStep1() {
    if (getValues("name").length > 0 && getValues("cpf").length > 0 && getValues("email").length > 0 && getValues("password") && getValues("telephone") &&
      getValues("bornDate") && getValues("gender") && getValues("ethnicity")
    ) {
      setStep(step + 1);
    }
  }

  async function validateStep2() {

    const data = await isCepValid(getValues("address.cep"));

    if (data.status === 200) {
      clearErrors("address.cep");
      const response = data as CepData;
      setValue("address.nameStreet", response.address);
      setValue("address.state", response.state);
      setValue("address.city", response.city);
      setInputDisabled(true);
      setStep(step + 1);
    }

    if (data.status === 404) {
      setError("address.cep", { message: "Cep inválido" })
    }
  }

  function onSubmit(data: createUserFormData) {
    console.log(data);
  }

  function addNewGraduation() {
    append({ name: "", dateStart: "", dateEnd: "", isCollegePrivate: false, isSchoolPublic: false });
  }

  function removeGraduation(id: string) {
    remove(Number(id));
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-white text-base p-2">

      <section className="w-1/2 h-auto md:text-[12px] sm:text-[10px] flex flex-col border-2 rounded-sm p-4 gap-1">

        <div className="w-full flex items-center justify-between rounded-sm sm:flex-col sm:items-center">

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 1 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 1 && 'text-white'}`}>1</p>
            </div>
            <p className={` ml-2 text-[#8D8D99] ${step === 1 && 'text-black'}`}>Dados Pessoais</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt="" />

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 2 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 2 && 'text-white'}`}>2</p>
            </div>
            <p className={`ml-2 text-[#8D8D99] ${step === 2 && 'text-black'}`}>Endereço</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt="" />

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 3 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 3 && 'text-white'}`}>3</p>
            </div>
            <p className={`ml-2 text-[#8D8D99] ${step === 3 && 'text-black'}`}>Graduação</p>
          </div>
        </div>

        <div className="w-full h-px border-2 my-8" />

        <form className="w-full flex items-start flex-col" onSubmit={handleSubmit(onSubmit)}>
          {
            step === 1 && (
              <div className="w-full flex flex-col gap-4">

                <div className="w-full flex flex-col">
                  <label className="text-black">Nome</label>
                  <input autoComplete="off" {...register("name")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none" placeholder="Como prefere ser chamado" />
                  {errors.name && <p className="text-red-900">{errors.name.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">CPF</label>
                  <input minLength={11} maxLength={11} autoComplete="off" {...register("cpf")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu cpf" />
                  {errors.cpf && <p className="text-red-900">{errors.cpf.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">E-mail</label>
                  <input autoComplete="off" {...register("email")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu e-mail" />
                  {errors.email && <p className="text-red-900">{errors.email.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Senha</label>
                  <input autoComplete="off" {...register("password")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite sua senha" />
                  {errors.password && <p className="text-red-900">{errors.password.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Telefone</label>
                  <input minLength={11} maxLength={11} autoComplete="off" {...register("telephone")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu telefone" />
                  {errors.telephone && <p className="text-red-900">{errors.telephone.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Data de Nascimento</label>
                  <input autoComplete="off" {...register("bornDate")} type="date" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" />
                  {errors.bornDate && <p className="text-red-900">{errors.bornDate.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Raça</label>
                  <input autoComplete="off" {...register("ethnicity")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite sua raça" />
                  {errors.ethnicity && <p className="text-red-900">{errors.ethnicity.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Genero</label>
                  <input autoComplete="off" {...register("gender")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu genero" />
                  {errors.gender && <p className="text-red-900">{errors.gender.message}</p>}
                </div>

                <div className="w-full flex items-center justify-between mt-8">
                  <div />
                  <button type="button" className="p-2 rounded-lg bg-[#633BBC] text-white uppercase" onClick={() => validateStep1()}>Continuar</button>
                </div>

              </div>
            )
          }
          {
            step === 2 && (
              <div className="w-full flex flex-col gap-4 ">

                <div className="w-full flex flex-col">
                  <label className="text-black">CEP</label>
                  <input minLength={9} maxLength={9} autoComplete="off" {...register("address.cep")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none" placeholder="Digite o cep" />
                  {errors.address?.cep && <p className="text-red-900">{errors.address.cep.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Nome da rua</label>
                  <input disabled={inputDisabled} autoComplete="off" {...register("address.nameStreet")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o nome da rua" />
                  {errors.address?.nameStreet && <p className="text-red-900">{errors.address.nameStreet.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Numero da rua</label>
                  <input autoComplete="off" {...register("address.numberStreet")} type="number" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o número da sua rua" />
                  {errors.address?.numberStreet && <p className="text-red-900">{errors.address.numberStreet.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Complemento</label>
                  <input disabled={inputDisabled} autoComplete="off" {...register("address.complement")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Caso não tenha, não digite" />
                  {errors.address?.complement && <p className="text-red-900">{errors.address.complement.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Cidade</label>
                  <input disabled={inputDisabled} autoComplete="off" {...register("address.city")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Caso não tenha, não digite" />
                  {errors.address?.complement && <p className="text-red-900">{errors.address.complement.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Estado</label>
                  <input disabled={inputDisabled} autoComplete="off" {...register("address.state")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Caso não tenha, não digite" />
                  {errors.address?.complement && <p className="text-red-900">{errors.address.complement.message}</p>}
                </div>

                <div className="w-full flex flex-col">
                  <label className="text-black">Bairro</label>
                  <input autoComplete="off" {...register("address.neighborhood")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Caso não tenha, não digite" />
                  {errors.address?.complement && <p className="text-red-900">{errors.address.complement.message}</p>}
                </div>

                <div className="w-full flex items-center justify-between mt-8">
                  <button type="button" className="uppercase w-36 text-[#633BBC] border-2 border-[#633BBC] bg-white rounded-lg p-2" onClick={() => setStep(step - 1)}>Voltar</button>
                  <button type="submit" className="p-2 rounded-lg bg-[#633BBC] text-white uppercase" onClick={() => validateStep2()}>Continuar</button>
                </div>

              </div>
            )
          }
          {
            step === 3 && (
              <div className="w-full flex flex-col gap-4 ">
                <div className="w-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-black">Graduações</label>
                    <button onClick={addNewGraduation} type="button" className="text-emerald-500 text-xs">Adicionar</button>
                  </div>
                  <fieldset className="flex flex-col items-start">
                    {
                      fields.map((field, index) => {
                        return (
                          <div key={field.id} className="flex flex-col items-start">
                            <div className="flex flex-col items-start">

                              <div className="flex items-center justify-between">
                                <label className="text-black">Nome da Graduação</label>
                                <button onClick={() => removeGraduation(field.id)} type="button" className="text-red-900 text-xs">Remover</button>
                              </div>

                              <input type="text"
                                placeholder="Digite o nome da instituição"
                                className="ml-4 p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none"
                                {...register(`graduation.${index}.name`)}
                              />

                              {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.name?.message}</p>}

                            </div>
                            <div className="flex flex-col items-start">
                              <label className="text-black">Data de começo</label>
                              <input
                                placeholder="ml-4 Informe a data que começou o curso"
                                type="date"
                                className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none"
                                {...register(`graduation.${index}.dateStart`)}
                              />
                              {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.dateStart?.message}</p>}
                            </div>
                            <div className="flex flex-col items-start">
                              <label className="text-black">Data de enceramento do curso</label>
                              <input
                                type="date"
                                placeholder="Informe a data que encerrou o curso"
                                className="ml-4 p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none"
                                {...register(`graduation.${index}.dateEnd`)}
                              />
                              {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.dateEnd?.message}</p>}
                            </div>

                            <div className="flex flex-col items-start">
                              <label className="text-black" >É uma instituição privada ?</label>
                              <input
                                placeholder="Informe se é uma instituição privada"
                                className="ml-4 p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none"
                                {...register(`graduation.${index}.isCollegePrivate`)}
                              />
                              {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.isCollegePrivate?.message}</p>}
                            </div>
                            <div className="flex flex-col items-start">
                              <label className="text-black">É uma instituição publica ?</label>
                              <input
                                placeholder="Informe se é uma instituição publica"
                                className="ml-4 p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none"
                                {...register(`graduation.${index}.isSchoolPublic`)}
                              />
                              {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.isSchoolPublic?.message}</p>}
                            </div>
                          </div>
                        )
                      })
                    }
                    {errors.graduation && <p className="text-red-900">{errors.graduation.message}</p>}
                  </fieldset>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <div onClick={() => setValue("acceptRegulation", !watch("acceptRegulation"))} className={`w-8 h-8 mr-4 rounded-lg bg-white border-2 border-zinc-900 ${watch("acceptRegulation") && 'bg-green-900'}`} />
                      <p className="text-black">Voce aceita os termos de privacidade ?</p>
                    </div>
                    {errors.acceptRegulation && <p className="text-red-900">{errors.acceptRegulation.message}</p>}
                  </div>
                </div>
                <div className="w-full flex items-center justify-between mt-8">
                  <button type="button" className="uppercase w-36 text-[#633BBC] border-2 border-[#633BBC] bg-white rounded-lg p-2" onClick={() => setStep(step - 1)}>Voltar</button>
                  <button type="submit" className="p-2 rounded-lg bg-[#633BBC] text-white uppercase">Cadastrar-se</button>
                </div>
              </div>
            )
          }
        </form>
      </section>

    </main >
  )
}
