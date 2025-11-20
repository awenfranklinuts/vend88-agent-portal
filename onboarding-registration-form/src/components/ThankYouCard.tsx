import React from "react";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Card = styled.div`
  width: 920px;
  max-width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,255,250,0.9));
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 12px 30px rgba(20, 40, 80, 0.08), inset 0 1px 0 rgba(255,255,255,0.6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    padding: 2.5rem 1.25rem;
    gap: 1rem;
    border-radius: 20px;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 640px) {
    width: 70px;
    height: 70px;
  }
`;

const CheckIcon = styled.svg`
  width: 60px;
  height: 60px;
  stroke: white;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  
  @media (max-width: 640px) {
    width: 42px;
    height: 42px;
    stroke-width: 3.5;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #0b2b4a;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  
  @media (max-width: 640px) {
    font-size: 1.6rem;
  }
`;

const Message = styled.p`
  margin: 0;
  color: #3c5a78;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: 640px) {
    font-size: 0.95rem;
    line-height: 1.5;
    padding: 0 0.5rem;
  }
`;

const SubMessage = styled.p`
  margin: 0;
  color: #6b7f99;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 550px;
  
  @media (max-width: 640px) {
    font-size: 0.85rem;
    line-height: 1.65;
    padding: 0 0.5rem;
  }
`;

const InfoBox = styled.div`
  margin-top: 1rem;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, rgba(43, 123, 227, 0.08), rgba(94, 200, 255, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(43, 123, 227, 0.15);
  max-width: 550px;
  width: 100%;
  
  @media (max-width: 640px) {
    padding: 1rem;
    margin-top: 0.5rem;
    border-radius: 10px;
  }
`;

const InfoText = styled.p`
  margin: 0;
  color: #2b7be3;
  font-size: 0.9rem;
  line-height: 1.6;
  font-weight: 500;
  word-break: break-word;
  
  @media (max-width: 640px) {
    font-size: 0.8rem;
    line-height: 1.7;
  }
`;

interface ThankYouCardProps {
  lang: "en" | "zh";
}

export default function ThankYouCard({ lang }: ThankYouCardProps) {
  const content = {
    en: {
      title: "Thank You!",
      message: "Your registration has been successfully submitted.",
      subMessage:
        "We've received your information and our team will review it shortly. You'll receive a confirmation email within 24-48 hours.",
      infoText:
        "If you have any urgent questions, feel free to contact us at purchasing@pospal.com.au",
    },
    zh: {
      title: "谢谢！",
      message: "您的注册已成功提交。",
      subMessage:
        "我们已收到您的信息，我们的团队将很快进行审核。您将在 24-48 小时内收到确认电子邮件。",
      infoText: "如果您有任何紧急问题，请随时通过 purchasing@pospal.com.au 联系我们",
    },
  };

  const text = content[lang];

  return (
    <Card>
      <IconWrapper>
        <CheckIcon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </CheckIcon>
      </IconWrapper>

      <Title>{text.title}</Title>
      <Message>{text.message}</Message>
      <SubMessage>{text.subMessage}</SubMessage>

      <InfoBox>
        <InfoText>{text.infoText}</InfoText>
      </InfoBox>
    </Card>
  );
}