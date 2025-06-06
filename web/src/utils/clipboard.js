 const copyToClipboard = (text, setFeedback, feedbackValue, duration = 2000) => {
  return navigator.clipboard.writeText(text)
    .then(() => {
      setFeedback(feedbackValue);
      setTimeout(() => setFeedback(null), duration);
    })
    .catch(err => console.error('Falha ao copiar texto: ', err));
};
