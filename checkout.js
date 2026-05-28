document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Captura os dados do formulário
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const pagamento = document.getElementById("pagamento").value;
    const needChange = document.querySelector("input[name='need_change']:checked");
    const cashAmount = parseFloat(document.getElementById("cash-amount").value.replace(",", "."));
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (pagamento === "Dinheiro" && needChange && needChange.value === "sim") {
      if (isNaN(cashAmount) || cashAmount < total) {
        alert("Informe um valor de pagamento em dinheiro igual ou maior que o total para calcular o troco.");
        return;
      }
    }

    // Monta a mensagem do pedido
    const tv = total;
    let mensagem = "🍬 Pedido - Doceria da May\n\n";
    cart.forEach(item => {
      mensagem += `• ${item.name} (x${item.qty}) - R$ ${(item.price * item.qty).toFixed(2)}\n`;
    });
    mensagem += `📦 Total: R$ ${tv.toFixed(2)}\n\n`;
    mensagem += `👤 Nome: ${nome}\n📱 Telefone: ${telefone}\n🏠 Endereço: ${endereco}\n💳 Pagamento: ${pagamento}\n`;

    const needChangeSelected = document.querySelector("input[name='need_change']:checked");
    const paidValue = parseFloat(document.getElementById("cash-amount").value.replace(",", "."));
    if (pagamento === "Dinheiro" && needChangeSelected && needChangeSelected.value === "sim") {
      if (!isNaN(paidValue)) {
        mensagem += `💵 Pago com: R$ ${paidValue.toFixed(2).replace('.', ',')}\n`;
        const troco = paidValue - tv;
        if (!isNaN(troco) && troco >= 0) {
          mensagem += `🔁 Troco: R$ ${troco.toFixed(2).replace('.', ',')}\n`;
        }
      }
    }

    // Abre WhatsApp com a mensagem pronta
    window.open(`https://wa.me/5562984610025?text=${encodeURIComponent(mensagem)}`, "_blank");
  });

  const pagamentoSelect = document.getElementById("pagamento");
  const cashChangeSection = document.getElementById("cash-change-section");
  const cashAmountRow = document.getElementById("cash-amount-row");
  const cashAmountInput = document.getElementById("cash-amount");
  const changeResult = document.getElementById("change-result");
  const needChangeInputs = document.querySelectorAll("input[name='need_change']");

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function resetCashFields() {
    cashAmountRow.classList.add("hidden");
    changeResult.classList.add("hidden");
    changeResult.textContent = "";
    cashAmountInput.value = "";
    needChangeInputs.forEach(input => input.checked = false);
  }

  function updateChangeDisplay() {
    const total = getCartTotal();
    const paidValue = parseFloat(cashAmountInput.value.replace(",", "."));
    if (!isNaN(paidValue) && paidValue >= total && total > 0) {
      const troco = paidValue - total;
      changeResult.textContent = `Troco: R$ ${troco.toFixed(2).replace('.', ',')}`;
      changeResult.classList.remove("hidden");
    } else if (!isNaN(paidValue) && paidValue > 0 && total > 0) {
      changeResult.textContent = "O valor pago deve ser igual ou maior que o total.";
      changeResult.classList.remove("hidden");
    } else {
      changeResult.textContent = "";
      changeResult.classList.add("hidden");
    }
  }

  function handlePaymentChange() {
    if (pagamentoSelect.value === "Dinheiro") {
      cashChangeSection.classList.remove("hidden");
    } else {
      cashChangeSection.classList.add("hidden");
      resetCashFields();
    }
  }

  function handleNeedChange() {
    const selected = document.querySelector("input[name='need_change']:checked");
    if (selected && selected.value === "sim") {
      cashAmountRow.classList.remove("hidden");
      updateChangeDisplay();
    } else {
      cashAmountRow.classList.add("hidden");
      changeResult.classList.add("hidden");
      changeResult.textContent = "";
      cashAmountInput.value = "";
    }
  }

  pagamentoSelect.addEventListener("change", handlePaymentChange);
  needChangeInputs.forEach(input => input.addEventListener("change", handleNeedChange));
  cashAmountInput.addEventListener("input", updateChangeDisplay);
});
