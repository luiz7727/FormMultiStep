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
  name: z.string().min(4, { message: "O campo Nome é obrigatório." }).nonempty({ message: "O campo Nome é obrigatório." }),
  cpf: z.string().min(11, { message: "O CPF precisa ter no mínimo 11 números." }).max(11, { message: "O CPF precisa ter no máximo 11 números." })
    .nonempty({ message: "O campo CPF é obrigatório." }).refine((cpf) => isCpfValid(cpf), { message: "CPF inválido." }),
  email: z.string().nonempty({ message: "O campo Email é obrigatório." }),
  password: z.string().nonempty({ message: "O campo Senha é obrigatório." }).regex(/^(?=.*[A-Z])(?=.*\\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).+$/, { message: "Sua senha precisa ter ao menos uma letra maiúscula, número e um caracter especial." }),
  telephone: z.string().nonempty({ message: "O campo Telefone é obrigatório." }),
  bornDate: z.string().nonempty({ message: "O campo Data de Nascimento é obrigatório." }).refine((date) => isAdult(date), { message: "Você precisa ser maior de idade para realizar o cadastro." }),
  gender: z.string().min(4, { message: "O gênero precisa ter no mínimo 4 caracteres." }).nonempty({ message: "O campo Gênero é obrigatório." }),
  ethnicity: z.string().nonempty({ message: "O campo Raça é obrigatório." }),
  address: z.object({
    cep: z.string().nonempty({ message: "O campo CEP é obrigatório." }).min(8, { message: "O CEP precisa ter no mínimo 8 caracteres." }).max(8, { message: "o CEP precisa ter no máximo 8 caracteres." }),
    state: z.string().nonempty({ message:" O campo Estado é obrigatório."}),
    city: z.string().nonempty({ message: " O campo Cidade é obrigatório."}),
    neighborhood: z.string(). nonempty({ message: "O campo Bairro é obrigatório."}),
    nameStreet: z.string().nonempty({ message: "O campo Endereço é obrigatório." }),
    numberStreet: z.coerce.number().nonnegative({ message: "O número não pode ser negativo." }),
    complement: z.string().optional()
  }),
  graduation: z.array(z.object({
    name: z.string().nonempty({ message: "O campo Graduação é obrigatório." }),
    dateStart: z.string().nonempty({ message: "O campo Data Início é obrigatório." }),
    dateEnd: z.string().nonempty({ message: "O campo Data Fim é obrigatório." }),
    isIntitutionPrivate: z.boolean().default(false),
  })).min(1, "Insira pelo menos uma graduação"),
  acceptRegulation: z.boolean().default(false).refine((value) => value === true, { message: "Você precisa aceitar os Termos de Privacidade." })
}).required();

type createUserFormData = z.infer<typeof mySchema>;

export default function Home() {

  const [step, setStep] = useState<number>(1);

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

  async function searchCep() {
    const data = await isCepValid(getValues("address.cep"));

    if (data.status === 200) {
      clearErrors("address.cep");
      const response = data as CepData;
      setValue("address.nameStreet", response.address);
      setValue("address.state", response.state);
      setValue("address.city", response.city);
    }

    if (data.status === 404) {
      setError("address.cep", { message: "Cep inválido" })
    }
  }

  function validateStep2() {

    if(getValues("address.nameStreet").length > 0 && getValues("address.numberStreet") >= 0 && getValues("address.city").length > 0 && getValues("address.state").length > 0 && getValues("address.neighborhood").length > 0) {
      setStep(step + 1);
    }
  }

  function onSubmit(data: createUserFormData) {
    console.log(data);
  }

  function addNewGraduation() {
    append({ name: "", dateStart: "", dateEnd: "", isIntitutionPrivate: false });
  }

  function removeGraduation(id: string) {
    remove(Number(id));
  }

  



  return (
    <main className="w-screen flex items-center justify-center bg-white text-base p-2">

      <section className="w-full flex flex-col items-center justify-between rounded-md md:w-4/5 md:border-2 md:py-3 lg:border-2 lg:w-2/3 lg:py-3 xl:py-5 xl:border-2 xl:w-2/3 2xl:border-2 2xl:w-2/3 2xl:py-5">
        <div className="w-full flex items-center justify-between pt-4 md:p-2 md:px-20 lg:px-10 lg:pt-2 xl:px-10 xl:pt-2 2xl:pt-2 2xl:px-10" >
          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 1 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 1 && 'text-white'}`}>1</p>
            </div>
            <p className={`ml-1 text-[#8D8D99] ${step === 1 && 'text-black'}`}>Dados Pessoais</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt="" />

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 2 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 2 && 'text-white'}`}>2</p>
            </div>
            <p className={`ml-1 text-[#8D8D99] ${step === 2 && 'text-black'}`}>Endereço</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt="" />

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 3 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 3 && 'text-white'}`}>3</p>
            </div>
            <p className={`ml-1 text-[#8D8D99] ${step === 3 && 'text-black'}`}>Graduação</p>
          </div>

        </div>

        <div className="w-11/12 h-px md:border-2 lg:border-2 lg:items-center my-8 xl:border-2 2xl:border-2" />

        <form className="w-full flex items-center flex-col " onSubmit={handleSubmit(onSubmit)}>{
          step === 1 && (
            <div className="w-full md:w-11/12 lg:w-11/12 xl:w-11/12 2xl:w-11/12 ">

              <div className="w-full flex flex-col  py-3 lg:pt-1">
                <label className="text-black">Nome</label>
                <input autoComplete="off" {...register("name")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" placeholder="Nome Completo"/>
                {errors.name && <p className="text-red-900">{errors.name.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">CPF</label>
                <input minLength={11} maxLength={11} autoComplete="off" {...register("cpf")} type="text" className="p-2 rounded-md border-2 border-[#E1E1E6] text-black outline-none" placeholder="Somente números(xxxxxxxxxxx)" />
                {errors.cpf && <p className="text-red-900">{errors.cpf.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">E-mail</label>
                <input autoComplete="off" {...register("email")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" placeholder="email@email.com" />
                {errors.email && <p className="text-red-900">{errors.email.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">Senha</label>
                <input autoComplete="off" {...register("password")} type="password" className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" placeholder="Digite sua senha" />
                {errors.password && <p className="text-red-900">{errors.password.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">Telefone</label>
                <input minLength={11} maxLength={11} autoComplete="off" {...register("telephone")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" placeholder="(xx)xxxxxxxxx" />
                {errors.telephone && <p className="text-red-900">{errors.telephone.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">Data de Nascimento</label>
                <input autoComplete="off" {...register("bornDate")} type="date" className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" />
                {errors.bornDate && <p className="text-red-900">{errors.bornDate.message}</p>}
              </div>

              <div className="w-full flex flex-col py-3">
              <label className="text-black">Raça</label>
                <select className="p-2 border-2 border-[#E1E1E6] rounded-md text-black outline-none" defaultValue="" 
                {...register("ethnicity",{required:true})}>
                  <option value="" disabled>Selecionar</option>
                  <option value="1">amarelo</option>
                  <option value="2">branco</option>
                  <option value="3">indígena</option>
                  <option value="4">pardo</option>
                  <option value="5">preto</option>
                  <option value="6">prefiro não declarar</option>
                </select>
              </div>

              <div className="w-full flex flex-col py-3">
                <label className="text-black">Gênero</label>
                <input autoComplete="off" {...register("gender")} type="text" className="p-2 border-2 border-[#E1E1E6]  rounded-md text-black outline-none" placeholder="Digite seu gênero" />
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
                <input minLength={8} maxLength={8} autoComplete="off" {...register("address.cep")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none" placeholder="Digite o CEP" />
                {errors.address?.cep && <p className="text-red-900">{errors.address.cep.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Estado</label>
                <input autoComplete="off" {...register("address.state")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o Estado"/>
                {errors.address?.state && <p className="text-red-900">{errors.address.state.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Cidade</label>
                <input autoComplete="off" {...register("address.city")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite a Cidade"/>
                {errors.address?.city && <p className="text-red-900">{errors.address.city.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Bairro</label>
                <input autoComplete="off" {...register("address.neighborhood")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o Estado"/>
                {errors.address?.neighborhood && <p className="text-red-900">{errors.address.neighborhood.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Endereço</label>
                <input autoComplete="off" {...register("address.nameStreet")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o Endereço" />
                {errors.address?.nameStreet && <p className="text-red-900">{errors.address.nameStreet.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Número</label>
                <input autoComplete="off" {...register("address.numberStreet")} type="number" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o número da residência" />
                {errors.address?.numberStreet && <p className="text-red-900">{errors.address.numberStreet.message}</p>}
              </div>

              <div className="w-full flex flex-col">
                <label className="text-black">Complemento</label>
                <input autoComplete="off" {...register("address.complement")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Apartamento, condomínio, etc.(opcional)" />
                {errors.address?.complement && <p className="text-red-900">{errors.address.complement.message}</p>}
              </div>

              <div className="w-full flex items-center justify-between mt-8">
                <button type="button" className="uppercase w-36 text-[#633BBC] border-2 border-[#633BBC] bg-white rounded-lg p-2" onClick={() => setStep(step - 1)}>Voltar</button>
                <button type="button" className="p-2 rounded-lg bg-[#633BBC] text-white uppercase" onClick={() => validateStep2()}>Continuar</button>
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
                              {...register(`graduation.${index}.isIntitutionPrivate`)}
                            />
                            {errors.graduation?.[index] && <p className="text-red-900">{errors.graduation[index]?.isIntitutionPrivate?.message}</p>}
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

    </main>
  )
}
