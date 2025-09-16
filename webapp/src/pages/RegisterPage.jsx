import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ActionButton, FormField, PasswordField } from "../components/common";
import { formatCPF, formatPhoneNumber, removeFormatting } from "../../../shared/formatters";
import { validateEmail, validateCPF, validadeRawCPF, validatePhoneNumber, validateCEP } from "../../../shared/validators";
import { BRAZILIAN_STATES } from "../../../shared/brazilianStates";
import api from "../api/api";

function RegisterPage() {
  // Estado da aplicação
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Estados do formulário - Etapa 1: Dados básicos
  const [formData, setFormData] = useState({
    // Credenciais
    email: "",
    password: "",
    confirmPassword: "",
    
    // Dados pessoais
    nome: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    
    // Dados de endereço - Etapa 2
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
  });

  // Estados de validação
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Validação em tempo real
  useEffect(() => {
    const errors = {};

    // Validações da etapa 1
    if (touchedFields.email && formData.email) {
      if (!validateEmail(formData.email)) {
        errors.email = "Por favor, insira um e-mail válido";
      }
    }

    if (touchedFields.password && formData.password) {
      if (formData.password.length < 8) {
        errors.password = "A senha deve ter pelo menos 8 caracteres";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = "A senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número";
      }
    }

    if (touchedFields.confirmPassword && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "As senhas não coincidem";
      }
    }

    if (touchedFields.nome && formData.nome) {
      if (formData.nome.trim().length < 2) {
        errors.nome = "Nome deve ter pelo menos 2 caracteres";
      } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nome)) {
        errors.nome = "Nome deve conter apenas letras e espaços";
      }
    }

    if (touchedFields.cpf && formData.cpf) {
      const rawCpf = removeFormatting(formData.cpf);
      if (!validadeRawCPF(rawCpf)) {
        errors.cpf = "CPF inválido";
      }
    }

    if (touchedFields.telefone && formData.telefone) {
      const rawPhone = removeFormatting(formData.telefone);
      if (rawPhone.length < 10 || rawPhone.length > 11) {
        errors.telefone = "Telefone deve ter 10 ou 11 dígitos";
      }
    }

    if (touchedFields.dataNascimento && formData.dataNascimento) {
      const today = new Date();
      const birthDate = new Date(formData.dataNascimento);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 14) {
        errors.dataNascimento = "Você deve ter pelo menos 14 anos";
      } else if (age > 120) {
        errors.dataNascimento = "Data de nascimento inválida";
      }
    }

    // Validações da etapa 2
    if (touchedFields.cep && formData.cep) {
      if (!validateCEP(formData.cep)) {
        errors.cep = "CEP inválido";
      }
    }

    if (touchedFields.logradouro && formData.logradouro) {
      if (formData.logradouro.trim().length < 5) {
        errors.logradouro = "Logradouro deve ter pelo menos 5 caracteres";
      }
    }

    if (touchedFields.numero && formData.numero) {
      if (formData.numero.trim().length === 0) {
        errors.numero = "Número é obrigatório";
      }
    }

    if (touchedFields.bairro && formData.bairro) {
      if (formData.bairro.trim().length < 2) {
        errors.bairro = "Bairro deve ter pelo menos 2 caracteres";
      }
    }

    if (touchedFields.cidade && formData.cidade) {
      if (formData.cidade.trim().length < 2) {
        errors.cidade = "Cidade deve ter pelo menos 2 caracteres";
      }
    }

    if (touchedFields.uf && formData.uf) {
      if (!BRAZILIAN_STATES.find(state => state.value === formData.uf)) {
        errors.uf = "Estado inválido";
      }
    }

    setFieldErrors(errors);
  }, [formData, touchedFields]);

  // Funções auxiliares
  const handleInputChange = (field, value) => {
    let formattedValue = value;

    // Aplicar formatação específica
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatPhoneNumber(value);
    } else if (field === 'nome' || field === 'cidade' || field === 'bairro') {
      // Capitalizar primeira letra de cada palavra
      formattedValue = value.replace(/\b\w/g, l => l.toUpperCase());
    } else if (field === 'uf') {
      formattedValue = value.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Validação das etapas
  const isStep1Valid = () => {
    const requiredFields = ['email', 'password', 'confirmPassword', 'nome', 'cpf', 'telefone', 'dataNascimento'];
    const hasAllFields = requiredFields.every(field => 
      formData[field] && formData[field].toString().trim() !== ''
    );
    const hasNoErrors = requiredFields.every(field => !fieldErrors[field]);
    
    return hasAllFields && hasNoErrors;
  };

  const isStep2Valid = () => {
    const requiredFields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    const hasAllFields = requiredFields.every(field => 
      formData[field] && formData[field].toString().trim() !== ''
    );
    const hasNoErrors = requiredFields.every(field => !fieldErrors[field]);
    
    return hasAllFields && hasNoErrors;
  };

  // Buscar CEP automático
  const fetchAddressByCEP = async (cep) => {
    if (!cep || cep.length < 8) return;
    
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || ""
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  // Navegação entre etapas
  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
      setError("");
    } else {
      setError("Por favor, preencha todos os campos obrigatórios corretamente.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError("");
  };

  // Submissão final
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isStep2Valid()) {
      setError("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Preparar dados para o backend
      const registrationData = {
        name: formData.nome.trim(),
        cpf: removeFormatting(formData.cpf),
        email: formData.email.trim(),
        password: formData.password,
        phone: removeFormatting(formData.telefone),
        birth_date: formData.dataNascimento,
        address: {
          street: formData.logradouro.trim(),
          number: formData.numero.trim(),
          complement: formData.complemento.trim() || null,
          neighborhood: formData.bairro.trim(),
          city: formData.cidade.trim(),
          state: formData.uf,
          zip: removeFormatting(formData.cep)
        }
      };

      // Chamar API de registro
      const response = await api.auth.register(registrationData);
      
      if (response && response.success) {
        // Redirecionar para login com mensagem de sucesso
        navigate("/login", { 
          state: { 
            message: "Conta criada com sucesso! Faça login para continuar.",
            type: "success"
          }
        });
      }
    } catch (err) {
      console.error("Erro no registro:", err);
      
      // Tratamento específico de erros
      if (err.status === 409) {
        setError("Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.");
      } else if (err.status === 422) {
        const message = err?.data?.message || "Dados inválidos. Verifique as informações e tente novamente.";
        setError(message);
      } else if (err.status >= 500) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      } else {
        const message = err?.data?.message || err?.message || "Falha ao criar conta. Tente novamente.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container min-vh-100">
      <div className="register-card w-100">
        <div className="px-3 py-4 px-md-4 py-md-5">
          {/* Header Mobile-First */}
          <div className="mb-3 mb-md-4">
            {/* Top bar com botão voltar e progresso */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <button
                className="btn btn-link text-dark p-0 fs-4"
                onClick={() => navigate(-1)}
                aria-label="Voltar"
                type="button"
                disabled={loading}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              
              {/* Indicador de progresso mobile */}
              <div className="flex-grow-1 mx-3">
                <div className="progress" style={{ height: "6px" }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ 
                      width: `${(currentStep / 2) * 100}%`,
                      transition: "width 0.3s ease"
                    }}
                    aria-valuenow={currentStep}
                    aria-valuemin="1"
                    aria-valuemax="2"
                  ></div>
                </div>
                <div className="text-end mt-1">
                  <small className="text-muted fw-medium">{currentStep}/2</small>
                </div>
              </div>
            </div>
            
            {/* Título e descrição mobile-first */}
            <div className="text-center">
              <h1 className="fw-bold mb-2 h3-md">
                {currentStep === 1 ? (
                  <>Crie sua conta para usar o <span className="text-success">BusHere!</span></>
                ) : (
                  <>Quase lá! Complete seu <span className="text-success">endereço</span></>
                )}
              </h1>
              <p className="text-muted mb-0 fs-6">
                {currentStep === 1 ? (
                  "Preencha seus dados para continuar"
                ) : (
                  "Finalize seu cadastro com o endereço"
                )}
              </p>
            </div>
          </div>

          {/* Alert de erro mobile-friendly */}
          {error && (
            <div className="alert alert-danger d-flex align-items-start mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 mt-1 flex-shrink-0"></i>
              <span className="small">{error}</span>
            </div>
          )}

          {/* Formulário Mobile-First */}
          <form onSubmit={currentStep === 1 ? handleNextStep : handleSubmit} noValidate className="mb-3">
            {currentStep === 1 ? (
              <Step1
                formData={formData}
                fieldErrors={fieldErrors}
                onInputChange={handleInputChange}
                onBlur={handleBlur}
                loading={loading}
              />
            ) : (
              <Step2
                formData={formData}
                fieldErrors={fieldErrors}
                onInputChange={handleInputChange}
                onBlur={handleBlur}
                onCEPChange={fetchAddressByCEP}
                loading={loading}
              />
            )}

            {/* Botões de navegação mobile-first */}
            <div className="mt-4">
              {currentStep === 2 && (
                <div className="d-grid gap-2 d-md-flex">
                  <ActionButton
                    type="button"
                    variant="outline-secondary"
                    size="lg"
                    className="mb-2 mb-md-0 me-md-2 w-auto"
                    style={{ minWidth: "120px" }}
                    onClick={handlePrevStep}
                    disabled={loading}
                    icon="bi bi-arrow-left"
                  >
                    Voltar
                  </ActionButton>
                  
                  <ActionButton
                    type="submit"
                    variant="success"
                    size="lg"
                    className="flex-fill fw-semibold"
                    disabled={!isStep2Valid()}
                    loading={loading}
                    icon={!loading ? "bi bi-check-circle" : undefined}
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </ActionButton>
                </div>
              )}
              
              {currentStep === 1 && (
                <ActionButton
                  type="submit"
                  variant="success"
                  size="lg"
                  className="w-100 fw-semibold"
                  disabled={!isStep1Valid()}
                  loading={loading}
                  icon={!loading ? "bi bi-arrow-right" : undefined}
                >
                  {loading ? "Verificando..." : "Continuar"}
                </ActionButton>
              )}
            </div>
          </form>

          {/* Footer mobile-friendly */}
          {currentStep === 1 && (
            <div className="text-center">
              <p className="mb-3">
                <Link 
                  to="/login" 
                  className="text-decoration-none fw-semibold d-inline-block text-success fs-6"
                  style={{ padding: "8px 0" }}
                >
                  Já possui uma conta? Entre aqui
                </Link>
              </p>
              
              <small className="text-muted d-block lh-sm" style={{ 
                maxWidth: "280px",
                margin: "0 auto"
              }}>
                Ao criar uma conta, você concorda com nossos{" "}
                <Link to="/terms" className="text-decoration-none text-muted">
                  <u>Termos de Uso</u>
                </Link>{" "}
                e{" "}
                <Link to="/privacy" className="text-decoration-none text-muted">
                  <u>Política de Privacidade</u>
                </Link>
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente da Etapa 1 - Dados pessoais (Mobile-First)
function Step1({ formData, fieldErrors, onInputChange, onBlur, loading }) {
  return (
    <>
      {/* Dados de login */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
          DADOS DE ACESSO
        </h6>
        
        <FormField
          id="register-email"
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          required
          placeholder="seu@email.com"
          autoComplete="email"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.email}
        />

        <PasswordField
          id="register-password"
          label="Senha"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          onBlur={() => onBlur('password')}
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.password}
          helpText="Deve conter: maiúscula, minúscula e número"
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirmar senha"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          onBlur={() => onBlur('confirmPassword')}
          placeholder="Digite a senha novamente"
          required
          autoComplete="new-password"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.confirmPassword}
        />
      </div>

      {/* Dados pessoais */}
      <div className="mb-3">
        <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
          DADOS PESSOAIS
        </h6>
        
        <FormField
          id="register-nome"
          label="Nome completo"
          type="text"
          value={formData.nome}
          onChange={(e) => onInputChange('nome', e.target.value)}
          onBlur={() => onBlur('nome')}
          required
          placeholder="Seu nome completo"
          autoComplete="name"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.nome}
        />

        <div className="row gx-2">
          <div className="col-7">
            <FormField
              id="register-cpf"
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={(e) => onInputChange('cpf', e.target.value)}
              onBlur={() => onBlur('cpf')}
              required
              placeholder="000.000.000-00"
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.cpf}
              inputProps={{ maxLength: 14 }}
            />
          </div>
          <div className="col-5">
            <FormField
              id="register-data-nascimento"
              label="Nascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => onInputChange('dataNascimento', e.target.value)}
              onBlur={() => onBlur('dataNascimento')}
              required
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.dataNascimento}
              inputProps={{ 
                max: new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0],
                min: new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split('T')[0]
              }}
            />
          </div>
        </div>

        <FormField
          id="register-telefone"
          label="Telefone"
          type="tel"
          value={formData.telefone}
          onChange={(e) => onInputChange('telefone', e.target.value)}
          onBlur={() => onBlur('telefone')}
          required
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.telefone}
          inputProps={{ maxLength: 15 }}
        />
      </div>
    </>
  );
}

// Componente da Etapa 2 - Endereço (Mobile-First)
function Step2({ formData, fieldErrors, onInputChange, onBlur, onCEPChange, loading }) {
  return (
    <>
      <div className="mb-3">
        <h6 className="fw-semibold mb-3 text-muted small text-uppercase" style={{ letterSpacing: "0.5px" }}>
          ENDEREÇO
        </h6>
        
        <FormField
          id="register-cep"
          label="CEP"
          type="text"
          value={formData.cep}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
            onInputChange('cep', value);
            if (value.length === 9) {
              onCEPChange(value);
            }
          }}
          onBlur={() => onBlur('cep')}
          required
          placeholder="00000-000"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.cep}
          inputProps={{ maxLength: 9 }}
          helpText="Digite para buscar automaticamente"
        />

        <FormField
          id="register-logradouro"
          label="Logradouro"
          type="text"
          value={formData.logradouro}
          onChange={(e) => onInputChange('logradouro', e.target.value)}
          onBlur={() => onBlur('logradouro')}
          required
          placeholder="Rua, Avenida, etc."
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.logradouro}
        />

        <div className="row gx-2">
          <div className="col-7">
            <FormField
              id="register-numero"
              label="Número"
              type="text"
              value={formData.numero}
              onChange={(e) => onInputChange('numero', e.target.value)}
              onBlur={() => onBlur('numero')}
              required
              placeholder="123"
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.numero}
            />
          </div>
          <div className="col-5">
            <FormField
              id="register-complemento"
              label="Compl."
              type="text"
              value={formData.complemento}
              onChange={(e) => onInputChange('complemento', e.target.value)}
              placeholder="Apt, etc."
              disabled={loading}
              inputClassName="form-control-lg"
            />
          </div>
        </div>

        <FormField
          id="register-bairro"
          label="Bairro"
          type="text"
          value={formData.bairro}
          onChange={(e) => onInputChange('bairro', e.target.value)}
          onBlur={() => onBlur('bairro')}
          required
          placeholder="Nome do bairro"
          disabled={loading}
          inputClassName="form-control-lg"
          error={fieldErrors.bairro}
        />

        <div className="row gx-2">
          <div className="col-8">
            <FormField
              id="register-cidade"
              label="Cidade"
              type="text"
              value={formData.cidade}
              onChange={(e) => onInputChange('cidade', e.target.value)}
              onBlur={() => onBlur('cidade')}
              required
              placeholder="Nome da cidade"
              disabled={loading}
              inputClassName="form-control-lg"
              error={fieldErrors.cidade}
            />
          </div>
          <div className="col-4">
            <div className="mb-3">
              <label htmlFor="register-uf" className="form-label font-family-segundaria">
                UF <span className="text-danger ms-1">*</span>
              </label>
              <select
                id="register-uf"
                className={`form-select form-control-lg ${fieldErrors.uf ? 'is-invalid' : ''}`}
                value={formData.uf}
                onChange={(e) => onInputChange('uf', e.target.value)}
                onBlur={() => onBlur('uf')}
                required
                disabled={loading}
              >
                <option value="">UF</option>
                {BRAZILIAN_STATES.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.value}
                  </option>
                ))}
              </select>
              {fieldErrors.uf && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {fieldErrors.uf}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;