// Cache para cores de ícones
const IconColorCache = new Map();

/**
 * Retorna uma cor de ícone baseada em algum valor
 * @param {string} str - Valor baseado no qual a cor do ícone será determinada
 * @return {string} - Retorna uma cor em formato hexadecimal ou nome de cor
 */
export function getColorBasedOnValue(str) {
  console.log("getColorBasedOnValue called with:", str, typeof str);
  if (typeof str !== "string" || !str) {
    return "red"; 
  }

  if (IconColorCache.has(str)) {
    return IconColorCache.get(str); // Retorna a cor do cache
  }

  const hash = Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = (hash**7) % 360 ; // Gera um valor de matiz baseado no hash
  const color = `hsl(${hue}, 100%, 50%)`; // Retorna uma cor HSL
  
  // Adiciona a cor ao cache
  IconColorCache.set(str, color);
  
  return color;
}
