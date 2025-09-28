import React, { useState } from 'react';
import { PageHeader, InfoCard, ActionButton, ContactInfo } from '../components';

const HelpPage = () => {
  const [activeAccordion, setActiveAccordion] = useState('');

  const faqs = [
    {
      id: '1',
      question: 'Como usar o aplicativo?',
      answer: 'O aplicativo é simples de usar. Basta abrir o menu lateral e selecionar a opção desejada. Use o mapa para visualizar rotas e pontos de ônibus.'
    },
    {
      id: '2',
      question: 'Como pagar meus boletos?',
      answer: 'Na seção de boletos, você pode visualizar todos os seus boletos pendentes e pagá-los diretamente pelo aplicativo ou baixar para pagar em bancos.'
    },
    {
      id: '3',
      question: 'Como alterar minhas configurações?',
      answer: 'Acesse a seção de configurações através do menu lateral. Lá você pode personalizar notificações, privacidade e aparência do aplicativo.'
    },
    {
      id: '4',
      question: 'Como trocar o tema da aplicação?',
      answer: 'Use o botão de sol/lua localizado no cabeçalho da sidebar para alternar entre o tema claro e escuro.'
    },
    {
      id: '5',
      question: 'Como entrar em contato com o suporte?',
      answer: 'Para suporte técnico, envie um email para suporte@bushere.com.br ou use o formulário de contato disponível nesta página.'
    }
  ];

  const contactInfo = [
    { type: 'email', value: 'suporte@bushere.com.br' },
    { type: 'phone', value: '(11) 99999-9999' },
    { type: 'whatsapp', value: '(11) 99999-9999' },
    { type: 'schedule', value: 'Segunda a Sexta, 8h às 18h', label: 'Horário' }
  ];

  return (
    <div
      className="container-fluid page-content-with-floating-button"
      style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #141e30, #3d4e62ff)',
        minHeight: '100vh',
        color: '#fff'
      }}
    >
      <div className="row">
        <div className="col-12">
          <PageHeader
            icon="bi-question-circle"
            title="Central de Ajuda"
          />

          <div className="row g-4 mt-2">
            {/* Perguntas Frequentes */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-chat-quote', title: 'Perguntas Frequentes' }}
                variant="dark"
              >
                <div className="row g-3">
                  {faqs.map(faq => (
                    <div key={faq.id} className="col-12">
                      <div
                        onClick={() =>
                          setActiveAccordion(activeAccordion === faq.id ? '' : faq.id)
                        }
                        style={{
                          backgroundColor: '#303131ff',
                          borderRadius: '10px',
                          padding: '1rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontWeight: 600 }}>{faq.question}</span>
                          <i
                            className={`bi ${
                              activeAccordion === faq.id ? 'bi-chevron-up' : 'bi-chevron-down'
                            }`}
                          />
                        </div>
                        {activeAccordion === faq.id && (
                          <p
                            className="mt-2 mb-0"
                            style={{ fontSize: '0.9rem', color: '#d1d1d1' }}
                          >
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>

            {/* Contato */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-telephone', title: 'Contato' }}
                variant="dark"
              >
                <ContactInfo contacts={contactInfo} layout="grid" />
              </InfoCard>
            </div>

            {/* Formulário de Contato */}
            <div className="col-12">
              <InfoCard
                header={{ icon: 'bi-chat-dots', title: 'Envie uma Mensagem' }}
                variant="dark"
              >
                <form>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">Nome</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Seu nome completo"
                      style={{
                        backgroundColor: '#303131ff',
                        color: '#fff'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      placeholder="seu@email.com"
                      style={{
                        backgroundColor: '#303131ff',
                        color: '#fff'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Assunto</label>
                    <select
                      className="form-select form-select-sm"
                      style={{
                        backgroundColor: '#303131ff',
                        color: '#fff'
                      }}
                    >
                      <option>Dúvida Geral</option>
                      <option>Problema Técnico</option>
                      <option>Sugestão</option>
                      <option>Reclamação</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Mensagem</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="3"
                      placeholder="Descreva sua dúvida ou problema..."
                      style={{
                        backgroundColor: '#303131ff',
                        color: '#fff'
                      }}
                    ></textarea>
                  </div>

                  <ActionButton
                    icon="bi-send"
                    variant="success"
                    fullWidth
                    type="submit"
                  >
                    Enviar Mensagem
                  </ActionButton>
                </form>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
