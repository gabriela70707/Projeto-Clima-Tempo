import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface DiaPrevisao {
  data: string;
  dia: {
    temp_max: number;
    temp_min: number;
    condicao: {
      texto: string;
      icone: string;
    };
  };
}

interface Props {
  cidade: string;
}

const ContainerPrevisao = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const TituloPrevisao = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;
  color: #484848ff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: rgba(85, 83, 83, 0.5);
    border-radius: 3px;
  }
`;

const GradePrevisao = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CardPrevisao = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const NomeDia = styled.p`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  color: #292828ff;
`;

const IconeClima = styled.img`
  width: 64px;
  height: 64px;
  margin: 0.5rem auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const TextoCondicao = styled.p`
  font-size: 0.9rem;
  margin: 0.5rem 0;
  opacity: 0.9;
  color: black;
  flex-grow: 1;
`;

const FaixaTemperatura = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
`;

const TempMax = styled.span`
  color: #e47676ff;
  font-weight: 600;
`;

const TempMin = styled.span`
  color: #2e4e67ff;
  font-weight: 600;
`;

const TextoData = styled.p`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.3rem;
  color: black;
`;

const MensagemErro = styled.p`
  color: #ffcccb;
  text-align: center;
  background: rgba(255, 0, 0, 0.2);
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid rgba(255, 0, 0, 0.3);
`;

const Card: React.FC<Props> = ({ cidade }) => {
  const [previsao, setPrevisao] = useState<DiaPrevisao[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarPrevisao() {
      try {
        const chaveApi = 'aafacf464d2f4058934161520252907';
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${chaveApi}&q=${cidade}&days=3&lang=pt`;

        const resposta = await axios.get(url);
        const previsaoFormatada = resposta.data.forecast.forecastday.map((dia: any) => ({
          data: dia.date,
          dia: {
            temp_max: dia.day.maxtemp_c,
            temp_min: dia.day.mintemp_c,
            condicao: {
              texto: dia.day.condition.text,
              icone: dia.day.condition.icon
            }
          }
        }));
        
        setPrevisao(previsaoFormatada);
        setErro('');
      } catch {
        setErro('Não foi possível carregar a previsão 😢');
      }
    }

    if (cidade) {
      buscarPrevisao();
    }
  }, [cidade]);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  return (
    <ContainerPrevisao>
      <TituloPrevisao>Previsão para os próximos dias</TituloPrevisao>
      
      {erro ? (
        <MensagemErro>{erro}</MensagemErro>
      ) : (
        <GradePrevisao>
          {previsao.map((dia) => (
            <CardPrevisao key={dia.data}>
              <NomeDia>
                {new Date(dia.data).toLocaleDateString('pt-BR', { weekday: 'long' })}
              </NomeDia>
              <TextoData>{formatarData(dia.data)}</TextoData>
              <IconeClima 
                src={dia.dia.condicao.icone} 
                alt={dia.dia.condicao.texto}
              />
              <TextoCondicao>{dia.dia.condicao.texto}</TextoCondicao>
              <FaixaTemperatura>
                <div>
                  <TempMax>{dia.dia.temp_max}°</TempMax>
                </div>
                <div>
                  <TempMin>{dia.dia.temp_min}°</TempMin>
                </div>
              </FaixaTemperatura>
            </CardPrevisao>
          ))}
        </GradePrevisao>
      )}
    </ContainerPrevisao>
  );
};

export default Card;