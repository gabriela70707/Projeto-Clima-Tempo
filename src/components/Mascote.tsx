import React, { useEffect } from "react";
import styled from "styled-components";

interface Props {
  condicao: string; // "Chuva", "Ensolarado", etc.
}

const MascoteContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  position: relative;
  left: 2vw;

  &:hover .fala {
    opacity: 1;
    transform: translateY(-10px);
  }
`;

const Fala = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
`;

export const Mascote: React.FC<Props> = ({ condicao }) => {
  let imagem = "";
  let falaClima = "";

  const condicaoLower = condicao.toLowerCase();

  if (condicaoLower.includes("chuva")) {
    imagem = "/chuvoso.png";
    falaClima = "Prepare o guarda-chuva ";
  } else if (
    condicaoLower.includes("sol") ||
    condicaoLower.includes("ensolarado")
  ) {
    imagem = "/solzinho.png";
    falaClima = "Vale minha nossa, que solzão ";
  } else if (condicaoLower.includes("nublado")) {
    imagem = "/nublado.png";
    falaClima = "Dia meio tímido hoje";
  } else {
    imagem = "/mascote-padrao.png";
    falaClima = "Olá, eu sou o mascote trovoada!";
  }

  const falar = (texto: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(texto);

    const vozes = synth.getVoices();
    const vozFofa = vozes.find(
      (v) => v.lang.includes("pt") || v.name.toLowerCase().includes("brazil")
    );

    if (vozFofa) {
      utter.voice = vozFofa;
    }

    utter.pitch = 1.5; // voz mais aguda
    utter.lang = "pt-BR";
    utter.rate = 0.9; // fala mais calma
    synth.speak(utter);
  };

  const handleMouseEnter = () => {
    falar(falaClima);
  };

  return (
    <MascoteContainer onMouseEnter={handleMouseEnter}>
      <img src={imagem} alt="Mascote do clima" width="150" />
      <Fala className="fala">{falaClima}</Fala>
    </MascoteContainer>
  );
};
