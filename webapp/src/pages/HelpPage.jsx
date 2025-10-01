import React, { useState } from "react";
import { PageHeader, InfoCard } from "../components";

const HelpPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faq = [
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

  const filteredFaq = faq.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <PageHeader
          icon="bi bi-info-circle-fill"
          title="Central de Ajuda"
      />

      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* FAQ */}
          <InfoCard
            header={{ icon: 'bi-chat-quote', title: 'Perguntas Frequentes' }}
              variant="dark"
          >
            
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Pesquisar dúvida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="accordion" id="faqAccordion">
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        activeQuestion === index ? "" : "collapsed"
                      }`}
                      type="button"
                      onClick={() => toggleQuestion(index)}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${
                      activeQuestion === index ? "show" : ""
                    }`}
                  >
                    <div className="accordion-body">{item.answer}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Nenhuma dúvida encontrada.</p>
            )}
          </div>
          </InfoCard>

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">Precisa de ajuda?</h5>
              <p className="card-text">
                Aqui você encontra respostas para dúvidas frequentes e informações para entrar em contato.
              </p>
              <a href="mailto:suporte@bushere.com" className="btn btn-primary">
                Falar com o suporte
              </a>
            </div>
          </div>

          {/* Formulário de envio de e-mail */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">Envie uma mensagem</h5>
              <form>

                <div className="mb-3">
                  <label className="form-label">Seu nome</label>
                  <input type="text" className="form-control" placeholder="Digite seu nome" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Seu e-mail</label>
                  <input type="email" className="form-control" placeholder="Digite seu e-mail" />
                </div>

                  <select className="form-select form-select-sm mb-2 ">
                    <option>Dúvida Geral</option>
                    <option>Problema Técnico</option>
                    <option>Sugestão</option>
                    <option>Reclamação</option>
                  </select>

                <div className="mb-3">
                  <label className="form-label">Mensagem</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Digite sua mensagem"
                  ></textarea>
                </div>
                <button type="button" className="btn btn-success">
                  Enviar
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpPage;

