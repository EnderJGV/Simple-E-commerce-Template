export function textLimiter(text, maxLength) {
    if (text.length <= maxLength) return text;
    const trimmedText = text.slice(0, maxLength);
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
    return (lastSpaceIndex > 0 ? trimmedText.slice(0, lastSpaceIndex) : trimmedText) + "...";
}

export function currencyFormatter(value) {
    if (typeof value === 'number') {
      const valueString = value.toFixed(2);
        const [inteira, decimal] = valueString.split('.');
        const inteiraFormatada = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return `R$ ${inteiraFormatada},${decimal}`;
    }
  
    return 'R$ 0,00';
  }