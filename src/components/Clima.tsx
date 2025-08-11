import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Card  from './Card.tsx';

interface WeatherResponse {
    location : {
        name : string;
        country : string;
        localtime : string;
    };
    
    current : {
        temp_c : number;
        humidity : number;
        feelslike_c : number;
        last_updated : string;
        icon : string;
        wind_kph : number;

    };
}

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1); /* Transparência */
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px); /* Desfoque */
  -webkit-backdrop-filter: blur(10px); /* Suporte para Safari */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Borda sutil */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); /* Sombra suave */
  color: #fff; /* Texto branco para contraste */
`;

const Main = styled.div`
    min-height: 100vh;
    max-width: 100vw;
    background: linear-gradient(to right, #4B72D5 28%,rgb(37, 78, 183) 69%,rgb(9, 37, 107) 100%);
    
`;

export function Clima(){
    const [ cidade, setCidade ] = useState('');
    const [ temperatura, setTemperatura ] = useState <number | null>(null);
    const [ umidade, setUmidade ] = useState <number | null>(null);
    const [ sensacaoTermica, setSensacaoTermica ] = useState <number | null>(null);
    const [ velocidadeVento, setVelocidadeVento ] = useState <number | null>(null);
    const [ nomeCidade, setNomeCidade ] = useState('');
    const [ ultimaAtualizacao, setUltimaAtualizacao] = useState('');
    const [ icone, setIcone] = useState('');
    const [iconeFalado, setIconeFalado] = useState('');
    const [ erro, setErro ] = useState('');
    const [ dataAtual, setDataAtual ] = useState('');


    async function buscarClima(){
        if (!cidade) return;

        try{
            const apiKey = 'aafacf464d2f4058934161520252907'
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cidade}&lang=pt`

            const resposta = await axios.get<WeatherResponse>(url)
            setNomeCidade(resposta.data.location.name)
            setTemperatura(resposta.data.current.temp_c)
            setUmidade(resposta.data.current.humidity)
            setSensacaoTermica(resposta.data.current.feelslike_c)
            setUltimaAtualizacao(resposta.data.current.last_updated)
            setIcone(resposta.data.current.condition.icon)
            setIconeFalado(resposta.data.current.condition.text)
            setDataAtual(resposta.data.location.localtime)
            setVelocidadeVento(resposta.data.current.wind_kph)
            
            setErro ('')

        } catch{
            setErro("Cidade não encontrada!")
            setNomeCidade('');
            setUltimaAtualizacao('');
            setTemperatura(null);
            setUmidade(null);
            setSensacaoTermica(null);
        }
    }

    return(
        <Main>
            <GlassContainer>
                <div style={{padding:'20px', textAlign:"center", color: 'white'}}>
                    <h2>Temperatura</h2>

                    <input type="text" placeholder="Digita a cidade ai: " value={cidade} onChange={(e) => setCidade(e.target.value)}
                    style={{padding : '8px', fontSize:'16px'}}/>

                    <button onClick={buscarClima} style={{padding:'8px 16px', marginLeft:'10px'}}>Buscar</button>
                    
                    {temperatura !== null && (<p style={{marginTop : '20px'}}>{nomeCidade} : {temperatura} °C</p>)}
                    {velocidadeVento !== null && (<p style={{marginTop : '20px'}}>{nomeCidade} : {velocidadeVento} KM</p>)}
                    {umidade !== null && (<p style={{marginTop : '20px'}}>{nomeCidade} : {umidade} %</p>)}
                    {sensacaoTermica !== null && (<p style={{marginTop : '20px'}}>{nomeCidade} : {sensacaoTermica} °C</p>)}
                    {ultimaAtualizacao !== '' && (<p style={{marginTop : '20px'}}>Ultima Atualização: {nomeCidade} : {ultimaAtualizacao}</p>)}
                    {iconeFalado !== '' && (<p style={{marginTop : '20px'}}>Condição do tempo: {iconeFalado}</p>)}
                    {dataAtual !== '' && (<p style={{marginTop : '20px'}}>Data e horario atual: {dataAtual}</p>)}
                    {icone  != '' && (<img src={icone} alt="Icone do clima" />)}


                    {erro && <p style={{color:'red'}}>{erro}</p>}

                    {nomeCidade !== '' && (<Card/>)}

                </div>
            </GlassContainer>
        </Main>
    )

}