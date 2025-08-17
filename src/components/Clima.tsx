import { useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import Card from "./Card.tsx";
import { Mascote } from "./Mascote.tsx";

interface WeatherResponse {
    location: {
        name: string;
        country: string;
        localtime: string;
    };
    current: {
        temp_c: number;
        humidity: number;
        feelslike_c: number;
        last_updated: string;
        condition: {
            text: string;
            icon: string;
        };
        wind_kph: number;
    };
}

interface MainProps {
    fundo: string;
    color: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Main = styled.div<MainProps>`
  min-height: 100vh;
  max-width: 100vw;
  background: ${(props) => props.fundo};
  transition: background 0.5s ease;
  color: ${(props) => props.color};
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  max-width: 95vw;
  margin: 2rem auto;
  min-height: 80vh;
  position: relative;
  overflow: hidden;
  flex: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    z-index: -1;
  }
`;

const Cabecalho = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const CampoBusca = styled.input`
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  width: 300px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &::placeholder {
    color: rgba(43, 41, 41, 0.7);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const BotaoBusca = styled.button`
  padding: 12px 28px;
  border-radius: 50px;
  border: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2));
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.3));
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Conteudo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Informacoes = styled.div`
  flex: 1;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
    text-shadow: 0 2px 4px rgba(60, 59, 59, 0.1);
    position: relative;
    padding-bottom: 10px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: rgba(249, 245, 245, 0.5);
      border-radius: 3px;
    }
  }
  
  p {
    font-size: 1.1rem;
    margin: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  img {
    height: 100px;
    margin: 10px 0;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }
`;

const RodapeMascote = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 10;
  transition: all 0.5s ease;
  
  &:hover {
    transform: translateY(-10px) scale(1.05);
  }
  
  @media (max-width: 768px) {
    position: static;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

const ErroMensagem = styled.p`
  color: #ff6b6b !important;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  animation: ${fadeIn} 0.3s ease-out;
`;

const DestaqueCidade = styled.h3`
  font-size: 2rem;
  
  margin: 15px 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  background: rgba(255,255,255,0.15);
  padding: 10px 20px;
  border-radius: 12px;
  display: inline-block;
`;

function obterEstiloClima(condicao: string): { background: string; corTexto: string } {
    const texto = condicao.toLowerCase();

    if (texto.includes("chuva")) {
        return {
            background: "linear-gradient(to right, #3a6073, #16222a)",
            corTexto: "#484848ff",
        };
    } else if (texto.includes("nublado") || texto.includes("encoberto")) {
        return {
            background: "linear-gradient(to right, #bdc3c7, #2c3e50)",
            corTexto: "#484848ff",
        };
    } else if (texto.includes("sol") || texto.includes("ensolarado")) {
        return {
            background: "linear-gradient(to right, #fbc2eb, #a6c1ee)",
            corTexto: "#484848ff",
        };
    } else if (texto.includes("neve")) {
        return {
            background: "linear-gradient(to right, #e6f1f5, #cfd9df)",
            corTexto: "#484848ff",
        };
    } else if (texto.includes("neblina") || texto.includes("névoa")) {
        return {
            background: "linear-gradient(to right, #757f9a, #d7dde8)",
            corTexto: "#484848ff",
        };
    } else {
        return {
            background: "linear-gradient(to right, #4B72D5, rgb(37, 78, 183), rgb(9, 37, 107))",
            corTexto: "white",
        };
    }
}

function formatarData(data: string): string {
    const dateObj = new Date(data.replace(" ", "T"));
    const diaSemana = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });
    const dia = dateObj.getDate();
    const mes = dateObj.toLocaleDateString("pt-BR", { month: "long" });
    const hora = dateObj.getHours().toString().padStart(2, "0");
    const minutos = dateObj.getMinutes().toString().padStart(2, "0");

    return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia} de ${mes} às ${hora}h${minutos}`;
}

export function Clima() {
    const [cidade, setCidade] = useState("");
    const [temperatura, setTemperatura] = useState<number | null>(null);
    const [umidade, setUmidade] = useState<number | null>(null);
    const [sensacaoTermica, setSensacaoTermica] = useState<number | null>(null);
    const [velocidadeVento, setVelocidadeVento] = useState<number | null>(null);
    const [nomeCidade, setNomeCidade] = useState("");
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
    const [icone, setIcone] = useState("");
    const [iconeFalado, setIconeFalado] = useState("");
    const [erro, setErro] = useState("");
    const [dataAtual, setDataAtual] = useState("");
    const estiloClima = obterEstiloClima(iconeFalado);

    async function buscarClima() {
        if (!cidade) return;

        try {
            const apiKey = "aafacf464d2f4058934161520252907";
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cidade}&lang=pt`;

            const resposta = await axios.get<WeatherResponse>(url);
            setNomeCidade(resposta.data.location.name);
            setTemperatura(resposta.data.current.temp_c);
            setUmidade(resposta.data.current.humidity);
            setSensacaoTermica(resposta.data.current.feelslike_c);
            setUltimaAtualizacao(resposta.data.current.last_updated);
            setIcone(resposta.data.current.condition.icon);
            setIconeFalado(resposta.data.current.condition.text);
            setDataAtual(resposta.data.location.localtime);
            setVelocidadeVento(resposta.data.current.wind_kph);

            setErro("");
        } catch {
            setErro("Cidade não encontrada!");
            setNomeCidade("");
            setUltimaAtualizacao("");
            setTemperatura(null);
            setUmidade(null);
            setSensacaoTermica(null);
            setVelocidadeVento(null);
            setIcone("");
            setIconeFalado("");
        }
    }

    return (
        <Main fundo={estiloClima.background} color={estiloClima.corTexto}>
            <GlassContainer>
                <Cabecalho>
                    <CampoBusca
                        type="text"
                        placeholder="Digite uma cidade..."
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { buscarClima() };
                        }}
                    />
                    <BotaoBusca onClick={buscarClima}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Buscar
                    </BotaoBusca>
                </Cabecalho>

                <Conteudo>
                    <Informacoes>
                        <h2>Informações do Clima</h2>
                        <div className="topo-card" style={{display: 'grid',justifyItems: 'center'}}>
                            {icone && <img src={icone} alt="Ícone do clima" />}
                            {nomeCidade && <DestaqueCidade>{nomeCidade}</DestaqueCidade>}
                        </div>
                        {temperatura !== null && <p>🌡️ Temperatura: {temperatura} °C</p>}
                        {sensacaoTermica !== null && <p>🥵 Sensação térmica: {sensacaoTermica} °C</p>}
                        {umidade !== null && <p>💧 Umidade: {umidade}%</p>}
                        {velocidadeVento !== null && <p>💨 Vento: {velocidadeVento} km/h</p>}
                        {iconeFalado && <p>🌥️ Condição: {iconeFalado}</p>}
                        {dataAtual && <p>🕒 Atualizado: {formatarData(dataAtual)}</p>}
                        {erro && <ErroMensagem>{erro}</ErroMensagem>}
                    </Informacoes>

                    {nomeCidade && <Card cidade={nomeCidade} />}
                </Conteudo>
            </GlassContainer>

            <RodapeMascote>
                <Mascote condicao={iconeFalado} />
            </RodapeMascote>
        </Main>
    );
}