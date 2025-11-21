const http = require('http');
const url = require('url');

const PORT = 3000;

// Função auxiliar para enviar respostas JSON
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// 1. Calculadora de IMC (Índice de Massa Corporal)
function calcularIMC(peso, altura) {
  const imc = peso / (altura * altura);
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
}

// 2. Gerador de senha aleatória
function gerarSenha(tamanho = 12, incluirEspeciais = true) {
  const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const especiais = '!@#$%&*()_+-=[]{}|;:,.<>?';
  
  let caracteres = letras + numeros;
  if (incluirEspeciais) caracteres += especiais;
  
  let senha = '';
  for (let i = 0; i < tamanho; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  return {
    senha,
    tamanho: senha.length,
    incluiEspeciais: incluirEspeciais
  };
}

// 3. Ordenador e análise de números
function analisarNumeros(numeros) {
  const nums = numeros.map(Number).filter(n => !isNaN(n));
  
  if (nums.length === 0) {
    return { erro: 'Nenhum número válido fornecido' };
  }
  
  const ordenadosCrescente = [...nums].sort((a, b) => a - b);
  const ordenadosDecrescente = [...nums].sort((a, b) => b - a);
  const soma = nums.reduce((acc, n) => acc + n, 0);
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
}

// 4. Conversor de temperatura
function converterTemperatura(valor, de, para) {
  valor = parseFloat(valor);
  de = de.toUpperCase();
  para = para.toUpperCase();
  
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
      celsius = valor - 273.15;
      break;
    default:
      return { erro: 'Escala de origem inválida. Use C, F ou K' };
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
    default:
      return { erro: 'Escala de destino inválida. Use C, F ou K' };
  }
  
  return {
    valorOriginal: valor,
    escalaOrigem: de,
    valorConvertido: resultado.toFixed(2),
    escalaDestino: para
  };
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // Endpoint raiz com documentação
  if (pathname === '/' || pathname === '/api') {
    sendJSON(res, 200, {
      mensagem: 'API de Utilitários Node.js',
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
          parametros: 'tamanho (opcional), especiais (true/false, opcional)',
          exemplo: '/api/senha?tamanho=16&especiais=true'
        },
        {
          rota: '/api/numeros',
          metodo: 'GET',
          parametros: 'lista (separada por vírgula)',
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
    
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
      sendJSON(res, 400, { erro: 'Parâmetros inválidos. Forneça peso e altura válidos.' });
    } else {
      sendJSON(res, 200, calcularIMC(peso, altura));
    }
  }
  
  // Endpoint 2: Gerador de senha
  else if (pathname === '/api/senha') {
    const tamanho = parseInt(query.tamanho) || 12;
    const especiais = query.especiais !== 'false';
    
    if (tamanho < 4 || tamanho > 50) {
      sendJSON(res, 400, { erro: 'Tamanho deve estar entre 4 e 50 caracteres.' });
    } else {
      sendJSON(res, 200, gerarSenha(tamanho, especiais));
    }
  }
  
  // Endpoint 3: Análise de números
  else if (pathname === '/api/numeros') {
    if (!query.lista) {
      sendJSON(res, 400, { erro: 'Forneça uma lista de números separados por vírgula.' });
    } else {
      const numeros = query.lista.split(',');
      sendJSON(res, 200, analisarNumeros(numeros));
    }
  }
  
  // Endpoint 4: Conversor de temperatura
  else if (pathname === '/api/temperatura') {
    const valor = query.valor;
    const de = query.de;
    const para = query.para;
    
    if (!valor || !de || !para) {
      sendJSON(res, 400, { erro: 'Forneça valor, escala de origem (de) e escala de destino (para).' });
    } else {
      const resultado = converterTemperatura(valor, de, para);
      if (resultado.erro) {
        sendJSON(res, 400, resultado);
      } else {
        sendJSON(res, 200, resultado);
      }
    }
  }
  
  // Rota não encontrada
  else {
    sendJSON(res, 404, { erro: 'Endpoint não encontrado' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});