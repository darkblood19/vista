export function agregarNotificacion(tipo, mensaje) {
  const notificaciones =
    JSON.parse(localStorage.getItem("notificaciones")) || [];

  notificaciones.unshift({
    tipo,
    mensaje,
    fecha: new Date().toLocaleString(),
  });

  localStorage.setItem(
    "notificaciones",
    JSON.stringify(notificaciones)
  );
}
