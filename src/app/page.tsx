"use client"

import { useState } from "react";
import { number, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import 'animate.css';

const mySchema = z.object({
  name: z.string().min(4,{ message:"Name is required" }),
  telephone:z.string(),
  email:z.string(),
  companyName:z.string(),
  employeeNumber:z.number(),
  aboutBusiness:z.string(),
  projectGoal:z.string()
}).required();


interface DataForm {
  name:string,
  telephone:string,
  email:string,
  companyName:string,
  employeeNumber:number,
  aboutBusiness:string,
  projectGoal:string
}

export default function Home() {

  const [step,setStep] = useState<number>(1);

  const { register, watch, handleSubmit,formState: { errors } } = useForm<DataForm>({
    resolver: zodResolver(mySchema)
  })

  console.log(errors);
  function onSubmit(data:DataForm) {
   console.log(data);
  }

  function validateBeforeGoToNextStep(numberStep:number) {
    if(numberStep === 1 && watch("name").length > 0 && watch("telephone").length > 0 && watch("email").length > 0) {
      setStep(step + 1);
    }

    if(numberStep === 2 && watch("companyName").length > 0 && watch("employeeNumber") && watch("aboutBusiness").length > 0) {
      setStep(step + 1);
    }
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-white text-base p-2">

      <section className="w-[37rem] h-auto flex flex-col border-2 rounded-sm p-4 gap-1">
        
        <div className="w-full flex items-center justify-between rounded-sm">

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 1 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 1 && 'text-white'}`}>1</p>
            </div>
            <p className={`ml-2 text-[#8D8D99] ${step === 1 && 'text-black'}`}>Contato</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt=""/>

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 2 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 2 && 'text-white'}`}>2</p>
            </div>
            <p className={`ml-2 text-[#8D8D99] ${step === 2 && 'text-black'}`}>Empresa</p>
          </div>

          <Image width={8} height={8} className="w-auto h-auto" src="https://i.imgur.com/9S7IJxm.png" alt=""/>

          <div className="flex items-center">
            <div className={`w-7 h-7 p-2 flex items-center justify-center rounded-full bg-[#E1E1E6] ${step === 3 && 'bg-violet-900'}`}>
              <p className={`text-[#8D8D99] ${step === 3 && 'text-white'}`}>3</p>
            </div>
            <p className={`ml-2 text-[#8D8D99] ${step === 3 && 'text-black'}`}>Projeto</p>
          </div>
        </div>

        <div className="w-full h-px border-2 my-8"/>

        <form className="w-full flex items-start flex-col" onSubmit={handleSubmit(onSubmit)}>
          {
            step === 1 && (
              <div className="w-full flex flex-col gap-4 ">

                <div className="w-full flex flex-col">
                  <label className="text-black">Nome</label>
                  <input autoComplete="off" {...register("name")} type="text" className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none" placeholder="Como prefere ser chamado"/>
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-black">Telefone</label>
                  <input autoComplete="off" { ...register("telephone") } type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu número de WhatsApp"/>
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-black">E-mail</label>
                  <input autoComplete="off" {...register("email")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite seu e-mail"/>
                </div>
                <div className="w-full flex items-center justify-between mt-8">
                  <div/>
                  <button className="p-2 rounded-sm bg-[#633BBC] text-white uppercase" onClick={() => validateBeforeGoToNextStep(step)}>Continuar</button>
                </div>
              </div>
            )
          }
          {
            step === 2 && (
              <div className="w-full flex flex-col gap-4 ">
                <div className="w-full flex flex-col">
                  <label className="text-black">Nome da empresa</label>
                  <input autoComplete="off" { ...register("companyName") } type="text" className="p-2 border-2 border-[#E1E1E6] rounded-sm text-black outline-none" placeholder="Qual é o nome da empresa"/>
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-black">Número de funcionários</label>
                  <input autoComplete="off" {...register("employeeNumber", {valueAsNumber:true})} type="number" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Digite o número de colaboradores"/>
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-black">Sobre seu negócio</label>
                  <input autoComplete="off" {...register("aboutBusiness")} type="text" className="p-2 border-2 border-[#E1E1E6] text-black outline-none" placeholder="Fale um pouco sobre seus produtos ou serviços"/>
                </div>

                <div className="w-full flex items-center justify-between mt-8">
                  <button className="uppercase w-36 text-[#633BBC] border-2 border-[#633BBC] bg-white rounded-sm p-2" onClick={() => setStep(step - 1)}>Voltar</button>
                  <button className="p-2 rounded-sm bg-[#633BBC] text-white uppercase" onClick={() => validateBeforeGoToNextStep(step)}>Continuar</button>
                </div>
              </div>
            )
          }
          {
            step === 3 && (
              <div className="w-full flex flex-col gap-4 ">
                <div className="w-full flex flex-col ">
                  <label className="text-black">Objetivo do projeto</label>
                  <textarea {...register("projectGoal")} className="h-24 border-2 p-2 text-black outline-none" placeholder="Descreva quais os objetivos desse projeto"></textarea>
                </div>
                <div className="w-full flex items-center justify-between mt-8">
                  <button className="uppercase w-36 text-[#633BBC] border-2 border-[#633BBC] bg-white rounded-sm p-2" onClick={() => setStep(step - 1)}>Voltar</button>
                  <button type="submit" className="p-2 rounded-sm bg-[#633BBC] text-white uppercase">Enviar Proposta</button>
                </div>
              </div>
            )
          }
        </form>
      </section>

    </main>
  )
}
