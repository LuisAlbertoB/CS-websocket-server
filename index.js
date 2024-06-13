const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 }, () => console.log("servidor websocket corriendo"));

const notificaciones = [
    { id: 1, cuerpo: "tienes un nuevo mensaje" },
    { id: 2, cuerpo: "te han asignado una tarea" }
];

wss.on('connection', (ws) => {
    console.log("cliente conectado");

    ws.on('message', (data) => {
        console.log("data: %s", data);
        const dataJson = JSON.parse(data);

        switch (dataJson.action) {
            case "createNotification":
                const idNotificacion = notificaciones.length > 0 ? notificaciones[notificaciones.length - 1].id + 1 : 1;

                const notificacion = {
                    id: idNotificacion,
                    cuerpo: dataJson.data.cuerpo
                }

                notificaciones.push(notificacion);

                // BROADCAST
                wss.clients.forEach(client => {
                    if (client.readyState == WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            event: "newNotification",
                            data: notificacion
                        }));
                    }
                });

                /* ws.send(JSON.stringify({
                    event: "newNotification",
                    data: notificacion
                })); */

                break;

            case "getNotifications":
                ws.send(JSON.stringify({
                    event: "getNotifications",
                    data: notificaciones
                }));
                break;
        }

        //ws.send("Hola cliente");
    });
});