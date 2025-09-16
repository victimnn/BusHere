import { useState } from "react";

function ProfilePage() {
    return(
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="p-4" style={{ width: "100%", height: "100%", maxWidth: "400px"}}>
                <div className="d-flex justify-content-start">
                    <button className="btn text-dark mt-1 p-0 m-0 fs-2 fw-bolder btn-end">✕</button>
                </div>
                <h5 className="text-center fw-bold mt-5 mb-4 font-family-principal fs-2 ">
                    Informações de <br /><span style={{color: "#0F9C42"}}>Cadastro</span>
                </h5>
                <form action="">
                    <label htmlFor="">Nome</label>
                    <input 
                        type="text"
                        className="form-control mt-1"
                        required
                        placeholder="Insira seu nome" 
                    />
                    <label htmlFor="" className="mt-2">Email</label>
                    <input 
                        type="email"
                        className="form-control mt-1"
                        required
                        placeholder="Insira seu e-mail" 
                    />
                    <label htmlFor="" className="mt-2">Telefone</label>
                    <input 
                        type="text"
                        className="form-control mt-1"
                        required
                        placeholder="Insira seu número" 
                    />
                    <label htmlFor=""></label>
                    <label htmlFor="" className="mt-2">Senha</label>
                    <input 
                        type="text"
                        className="form-control mt-1"
                        required
                        placeholder="Insira sua senha" 
                    />

                    <button className="btn btn-success w-100 mt-5">Continuar</button>
                </form>
            </div>
            
        </div>
    )
}

export default ProfilePage