/* ============================================================
   AJUSTES RÁPIDOS  (edita solo este archivo para cambiar el comportamiento)
   ============================================================ */
const AJUSTES = {
  /*
    Flujo al pulsar "Finalizar y generar PDF":
      1) Se genera el PDF y aparece "¡Pedido generado!".
      2) El cliente ve dos pasos: [Descargar PDF] y [Enviar por WhatsApp]
         (el botón de WhatsApp abre el chat con el número de la tienda y el
         resumen del pedido ya escrito; si aún no descargó el PDF, se descarga
         al pulsarlo para que pueda adjuntarlo).

    BOTON_COMPARTIR_PDF:
      false -> solo los dos pasos de arriba (recomendado: el cliente siempre
               sabe a quién envía).
      true  -> agrega un botón extra "Compartir PDF desde mi celular" (menú
               nativo del teléfono; ahí el cliente elige el contacto). Solo
               aparece en dispositivos que lo soportan.
  */
  BOTON_COMPARTIR_PDF: false,

  MONEDA: "$",
};
