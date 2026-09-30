/* ============================================================
   AJUSTES RÁPIDOS  (edita solo este archivo para cambiar el comportamiento)
   ============================================================ */
const AJUSTES = {
  /*
    Cómo se entrega el PDF al finalizar el pedido:

    false -> OPCIÓN 2 (activa ahora): se DESCARGA el PDF y aparece un botón
             "Abrir WhatsApp" con el resumen del pedido. El cliente adjunta
             el PDF descargado. Funciona en cualquier dispositivo.

    true  -> OPCIÓN 1: se abre el menú de compartir del celular y el PDF va
             adjunto directo a WhatsApp. Si el dispositivo no lo soporta,
             cae automáticamente a la opción 2.
  */
  COMPARTIR_PDF_NATIVO: false,

  MONEDA: "$",
};
