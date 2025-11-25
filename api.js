const http = require('http');
const url = require('url');

const PORT = 3000;

// Função auxiliar para enviar respostas JSON
function sendJSON(res, statusCode, data) {
  try {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  } catch (error) {
    // Fallback se falhar ao enviar JSON
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro interno ao processar resposta');
  }
}

// 1. Calculadora de IMC (Índice de Massa Corporal)
function calcularIMC(peso, altura) {
  try {
    // Validações adicionais
    if (altura === 0) {
      return { erro: 'Altura não pode ser zero' };
    }
    
    if (peso > 1000 || altura > 3) {
      return { erro: 'Valores fora do intervalo realista (peso máx: 1000kg, altura máx: 3m)' };
    }
    
    const imc = peso / (altura * altura);
    
    // Verifica se o resultado é um número válido
    if (!isFinite(imc)) {
      return { erro: 'Não foi possível calcular o IMC com os valores fornecidos' };
    }
    
    let classificacao = '';
    
    if (imc < 18.5) classificacao = 'Abaixo do peso';
    else if (imc < 25) classificacao = 'Peso normal';
    else if (imc < 30) classificacao = 'Sobrepeso';
    else if (imc < 35) classificacao = 'Obesidade Grau I';
    else if (imc < 40) classificacao = 'Obesidade Grau II';
    else classificacao = 'Obesidade Grau III';
    
    return {
      imc: imc.toFixed(2),
      classificacao,
      peso,
      altura
    };
  } catch (error) {
    return { erro: 'Erro ao calcular IMC: ' + error.message };
  }
}

// 2. Gerador de senha aleatória
function gerarSenha(tamanho = 12, incluirEspeciais = true) {
  try {
    // Validação de tamanho
    if (!Number.isInteger(tamanho) || tamanho < 4 || tamanho > 50) {
      return { erro: 'Tamanho deve ser um número inteiro entre 4 e 50' };
    }
    
    const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const especiais = '!@#$%&*()_+-=[]{}|;:,.<>?';
    
    let caracteres = letras + numeros;
    if (incluirEspeciais) caracteres += especiais;
    
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      senha += caracteres.charAt(indiceAleatorio);
    }
    
    return {
      senha,
      tamanho: senha.length,
      incluiEspeciais: incluirEspeciais
    };
  } catch (error) {
    return { erro: 'Erro ao gerar senha: ' + error.message };
  }
}

// 3. Ordenador e análise de números
function analisarNumeros(numeros) {
  try {
    // Validação de entrada
    if (!Array.isArray(numeros)) {
      return { erro: 'Entrada deve ser um array' };
    }
    
    if (numeros.length > 1000) {
      return { erro: 'Lista muito grande. Máximo de 1000 números permitidos' };
    }
    
    const nums = numeros.map(Number).filter(n => !isNaN(n) && isFinite(n));
    
    if (nums.length === 0) {
      return { erro: 'Nenhum número válido fornecido' };
    }
    
    const ordenadosCrescente = [...nums].sort((a, b) => a - b);
    const ordenadosDecrescente = [...nums].sort((a, b) => b - a);
    const soma = nums.reduce((acc, n) => acc + n, 0);
    
    // Verifica overflow na soma
    if (!isFinite(soma)) {
      return { erro: 'Soma dos números resultou em overflow' };
    }
    
    const media = soma / nums.length;
    const maior = Math.max(...nums);
    const menor = Math.min(...nums);
    
    return {
      numerosOriginais: nums,
      ordenadoCrescente: ordenadosCrescente,
      ordenadoDecrescente: ordenadosDecrescente,
      estatisticas: {
        quantidade: nums.length,
        soma: soma.toFixed(2),
        media: media.toFixed(2),
        maior,
        menor
      }
    };
  } catch (error) {
    return { erro: 'Erro ao analisar números: ' + error.message };
  }
}

// 4. Conversor de temperatura
function converterTemperatura(valor, de, para) {
  try {
    valor = parseFloat(valor);
    
    // Validação do valor
    if (isNaN(valor) || !isFinite(valor)) {
      return { erro: 'Valor de temperatura inválido' };
    }
    
    // Validação das escalas
    if (!de || !para) {
      return { erro: 'Escalas de origem e destino são obrigatórias' };
    }
    
    de = de.toUpperCase().trim();
    para = para.toUpperCase().trim();
    
    const escalasValidas = ['C', 'F', 'K'];
    
    if (!escalasValidas.includes(de)) {
      return { erro: 'Escala de origem inválida. Use C, F ou K' };
    }
    
    if (!escalasValidas.includes(para)) {
      return { erro: 'Escala de destino inválida. Use C, F ou K' };
    }
    
    let celsius;
    
    // Converter para Celsius primeiro
    switch(de) {
      case 'C':
        celsius = valor;
        break;
      case 'F':
        celsius = (valor - 32) * 5/9;
        break;
      case 'K':
        // Validação: Kelvin não pode ser negativo
        if (valor < 0) {
          return { erro: 'Temperatura em Kelvin não pode ser negativa' };
        }
        celsius = valor - 273.15;
        break;
    }
    
    // Validação: Celsius não pode ser menor que zero absoluto
    if (celsius < -273.15) {
      return { erro: 'Temperatura abaixo do zero absoluto (-273.15°C)' };
    }
    
    // Converter de Celsius para a escala desejada
    let resultado;
    switch(para) {
      case 'C':
        resultado = celsius;
        break;
      case 'F':
        resultado = (celsius * 9/5) + 32;
        break;
      case 'K':
        resultado = celsius + 273.15;
        break;
    }
    
    // Verifica se o resultado é válido
    if (!isFinite(resultado)) {
      return { erro: 'Resultado da conversão inválido' };
    }
    
    return {
      valorOriginal: valor,
      escalaOrigem: de,
      valorConvertido: resultado.toFixed(2),
      escalaDestino: para
    };
  } catch (error) {
    return { erro: 'Erro ao converter temperatura: ' + error.message };
  }
}

// Servidor HTTP com tratamento de erros global
const server = http.createServer((req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Proteção contra URL muito longa
    if (req.url.length > 2048) {
      sendJSON(res, 414, { erro: 'URL muito longa' });
      return;
    }
    
    // Endpoint raiz com documentação
    if (pathname === '/' || pathname === '/api') {
      sendJSON(res, 200, {
        mensagem: 'API de Utilitários Node.js',
        versao: '1.0.0',
        endpoints: [
          {
            rota: '/api/imc',
            metodo: 'GET',
            parametros: 'peso (kg), altura (m)',
            exemplo: '/api/imc?peso=70&altura=1.75'
          },
          {
            rota: '/api/senha',
            metodo: 'GET',
            parametros: 'tamanho (opcional, 4-50), especiais (true/false, opcional)',
            exemplo: '/api/senha?tamanho=16&especiais=true'
          },
          {
            rota: '/api/numeros',
            metodo: 'GET',
            parametros: 'lista (separada por vírgula, máx 1000)',
            exemplo: '/api/numeros?lista=5,2,8,1,9,3'
          },
          {
            rota: '/api/temperatura',
            metodo: 'GET',
            parametros: 'valor, de (C/F/K), para (C/F/K)',
            exemplo: '/api/temperatura?valor=25&de=C&para=F'
          }
        ]
      });
    }
    
    // Endpoint 1: Calculadora de IMC
    else if (pathname === '/api/imc') {
      const peso = parseFloat(query.peso);
      const altura = parseFloat(query.altura);
      
      if (!query.peso || !query.altura) {
        sendJSON(res, 400, { erro: 'Parâmetros peso e altura são obrigatórios' });
      } else if (isNaN(peso) || isNaN(altura) || !isFinite(peso) || !isFinite(altura)) {
        sendJSON(res, 400, { erro: 'Peso e altura devem ser números válidos' });
      } else if (peso <= 0 || altura <= 0) {
        sendJSON(res, 400, { erro: 'Peso e altura devem ser maiores que zero' });
      } else {
        const resultado = calcularIMC(peso, altura);
        if (resultado.erro) {
          sendJSON(res, 400, resultado);
        } else {
          sendJSON(res, 200, resultado);
        }
      }
    }
    
    // Endpoint 2: Gerador de senha
    else if (pathname === '/api/senha') {
      const tamanho = query.tamanho ? parseInt(query.tamanho) : 12;
      const especiais = query.especiais !== 'false';
      
      if (query.tamanho && isNaN(tamanho)) {
        sendJSON(res, 400, { erro: 'Tamanho deve ser um número válido' });
      } else if (tamanho < 4 || tamanho > 50) {
        sendJSON(res, 400, { erro: 'Tamanho deve estar entre 4 e 50 caracteres' });
      } else {
        const resultado = gerarSenha(tamanho, especiais);
        if (resultado.erro) {
          sendJSON(res, 400, resultado);
        } else {
          sendJSON(res, 200, resultado);
        }
      }
    }
    
    // Endpoint 3: Análise de números
    else if (pathname === '/api/numeros') {
      if (!query.lista) {
        sendJSON(res, 400, { erro: 'Forneça uma lista de números separados por vírgula' });
      } else if (typeof query.lista !== 'string') {
        sendJSON(res, 400, { erro: 'Lista deve ser uma string de números separados por vírgula' });
      } else {
        const numeros = query.lista.split(',');
        const resultado = analisarNumeros(numeros);
        if (resultado.erro) {
          sendJSON(res, 400, resultado);
        } else {
          sendJSON(res, 200, resultado);
        }
      }
    }
    
    // Endpoint 4: Conversor de temperatura
    else if (pathname === '/api/temperatura') {
      if (!query.valor || !query.de || !query.para) {
        sendJSON(res, 400, { 
          erro: 'Forneça valor, escala de origem (de) e escala de destino (para)',
          exemplo: '/api/temperatura?valor=25&de=C&para=F'
        });
      } else {
        const resultado = converterTemperatura(query.valor, query.de, query.para);
        if (resultado.erro) {
          sendJSON(res, 400, resultado);
        } else {
          sendJSON(res, 200, resultado);
        }
      }
    }
    
    // Rota não encontrada
    else {
      sendJSON(res, 404, { 
        erro: 'Endpoint não encontrado',
        rotas_disponiveis: ['/', '/api/imc', '/api/senha', '/api/numeros', '/api/temperatura']
      });
    }
    
  } catch (error) {
    // Catch-all para qualquer erro não tratado
    console.error('Erro não tratado:', error);
    sendJSON(res, 500, { 
      erro: 'Erro interno do servidor',
      mensagem: 'Ocorreu um erro inesperado ao processar sua requisição'
    });
  }
});

// Tratamento de erros do servidor
server.on('error', (error) => {
  console.error('Erro no servidor:', error);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Exceção não capturada:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promessa rejeitada não tratada:', reason);
});

server.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação disponível em http://localhost:${PORT}/api`);
});