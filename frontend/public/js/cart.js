const FRETE_FIXO = 20.00;

    function changeQty(botao, soma) {
      const item = botao.closest('.item');
      const qtditem = item.querySelector('.qtd');
      const subtotalitem = item.querySelector('.subtotal-value');
      const price = parseFloat(item.dataset.price);

      let qtd = parseInt(qtditem.textContent);
      qtd = Math.max(1, qtd + soma);
      qtditem.textContent = qtd;

      const novoSubtotal = (price * qtd).toFixed(2).replace('.', ',');
      subtotalitem.textContent = novoSubtotal;

      updateResumo();
    }

    function updateResumo() {
      let subtotal = 0;
      document.querySelectorAll('.item').forEach(item => {
        const price = parseFloat(item.dataset.price);
        const qtd = parseInt(item.querySelector('.qty').textContent);
        subtotal += price * qtd;
      });

      const total = subtotal + FRETE_FIXO;

      document.getElementById('subtotal').textContent = subtotal.toFixed(2).replace('.', ',');
      document.getElementById('frete').textContent = FRETE_FIXO.toFixed(2).replace('.', ',');
      document.getElementById('total').textContent = total.toFixed(2).replace('.', ',');
    }

    function removeItem(botao) {
      const item = botao.closest('.item');
      item.remove();
      updateResumo();
    }

    if (document.querySelectorAll('.item').length === 0) {
      document.getElementById('carrinho').innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    // Atualiza os totais
    updateResumo();
