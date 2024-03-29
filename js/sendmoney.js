$(document).ready(function () {
  // Mostrar formulario al hacer clic en el botón
  $("#showAddContactForm").click(function () {
    $("#addContactForm").show();
  });

  // Función para agregar un nuevo contacto a la lista HTML
  function agregarContactoHTML(contact) {
    let nuevoContactoHTML =
      '<li class="list-group-item">' +
      '<div class="contact-info text-center">' +
      '<span class="contact-name fw-bold d-block mx-auto" style="font-size: 16px;">' +
      contact.nombre +
      " - " +
      contact.cbu +
      "</span>" +
      '<span class="contact-details" style="font-size: 14px;">' +
      contact.banco +
      "<br>" +
      "</span>" +
      "</div>" +
      "</li>";
    $("#contactList").append(nuevoContactoHTML);
  }

  // Mostrar contactos almacenados en localStorage al cargar la página
  let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  contacts.forEach(function (contact) {
    agregarContactoHTML(contact);
  });

  // Verificar si la lista de contactos está vacía
  if (contacts.length === 0) {
    $("#contactHeader").text("No ha agregado contactos");
  } else {
    $("#contactHeader").text("Contactos");
  }

  // Manejar el envío del formulario para agregar contactos
  $("#addContactForm").submit(function (event) {
    event.preventDefault();

    let nombre = $("#contactName").val().trim();
    let cbu = $("#contactCBU").val().trim();
    let alias = $("#contactAlias").val().trim();
    let banco = $("#contactBank").val().trim();

    if (nombre === "" || cbu === "" || alias === "" || banco === "") {
      $("#incorrectData").text("Por favor, complete todos los campos.").show();

      setTimeout(function () {
        $("#incorrectData").hide();
      }, 1000);
      return;
    }

    // Guardar los detalles del contacto en localStorage
    let contactDetails = {
      nombre: nombre,
      cbu: cbu,
      alias: alias,
      banco: banco,
    };

    let contacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    contacts.push(contactDetails);
    localStorage.setItem("contacts", JSON.stringify(contacts));

    this.reset();

    $("#addContact").text("Contacto agregado correctamente!").show();
    // Agregar el nuevo contacto a la lista HTML
    agregarContactoHTML(contactDetails);

    setTimeout(function () {
      $("#addContact").hide();
      $("#addContactForm").hide();
    }, 1000);
  });

  // Manejar el botón de cancelar agregar contacto
  $("#cancelAddContact").click(function () {
    $("#addContactForm").hide();
  });

  // Cuando se hace clic en un contacto de la lista
  $("#contactList").on("click", "li", function () {
    // Si ya está marcado, desmarcarlo
    if ($(this).hasClass("contacto-seleccionado")) {
      $(this).removeClass("contacto-seleccionado");
      $("#moneyForm").hide();
    } else {
      // Si no está marcado, marcarlo y mostrar el formulario de ingreso de monto
      $("#contactList li").removeClass("contacto-seleccionado");
      $(this).addClass("contacto-seleccionado");
      $("#moneyForm").show();
    }
  });

  // Evento en el botón "Enviar"
  $("#sendMoneyBtn").click(function () {
    // Obtener el monto ingresado
    let amount = $("#amount").val().trim();

    // Verificar si el monto es válido (solo números)
    if (!/^\d*\.?\d+$/.test(amount)) {
      $("#invalidAmount").text("Por favor, ingrese un monto válido.").show();

      setTimeout(function () {
        $("#invalidAmount").hide();
      }, 1000);
      return;
    }

    // Convertir el monto a número
    amount = parseFloat(amount);

    // Verificar si el monto es menor o igual a cero
    if (amount <= 0) {
      $("#invalidAmount").text("Por favor, ingrese un monto válido.").show();

      setTimeout(function () {
        $("#invalidAmount").hide();
      }, 1000);
      return;
    }

    // Obtener saldo del Local Storage y convertirlo a número
    let saldo = parseFloat(localStorage.getItem("saldo") || 0);

    // Verificar si el monto es mayor que el saldo disponible
    if (amount > saldo) {
      $("#insufficientBalance").text("Saldo insuficiente.").show();

      setTimeout(function () {
        $("#insufficientBalance").hide();
      }, 1000);
      return;
    }

    // Restar el monto del saldo
    saldo -= amount;

    // Actualizar el saldo en localStorage
    localStorage.setItem("saldo", saldo);

    // Guardar los detalles de la transacción en Local Storage
    let transactionDetails = {
      fecha: new Date().toISOString().slice(0, 10),
      movimiento: "Envio de dinero",
      monto: amount,
    };

    let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push(transactionDetails);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Mostrar mensaje de confirmación
    $("#moneySent")
      .text("Se han enviado $" + amount + " correctamente.")
      .show();

    setTimeout(function () {
      $("#moneySent").hide();
      $("#moneyForm").hide();

      // Redireccionar al menú
      window.location.href = "menu.html";
    }, 2000);

    // Actualizar el saldo mostrado en el menú
    $("#balanceDisplay").text("$" + saldo);

    // Limpiar el campo de monto
    $("#amount").val("");

    // Deseleccionar el contacto
    $("#contactList li").removeClass("active");
  });

  // Función para filtrar contactos según el texto de búsqueda
  $("#searchContact").on("input", function () {
    let searchText = $(this).val().trim().toLowerCase();
    $("#contactList li").each(function () {
      var contactName = $(this)
        .find(".contact-name")
        .text()
        .trim()
        .toLowerCase();
      if (contactName.startsWith(searchText)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  // Manejar eventos de teclado para el campo de monto
  $("#amount").on("keydown", function (event) {
    // Permitir las teclas de navegación y borrar
    if (
      event.key == "ArrowLeft" ||
      event.key == "ArrowRight" ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      return;
    }
    // Permitir solo números
    else if (event.key.length === 1 && /[0-9]/.test(event.key) === false) {
      event.preventDefault();
    }
  });
});
