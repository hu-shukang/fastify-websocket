import { SocketStream } from '@fastify/websocket';
import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  const connections = new Set<SocketStream>();
  fastify.get('/chat', { websocket: true }, (connection, _req) => {
    connection.socket.send('connected!');
    connections.add(connection);

    connection.socket.on('message', (message: any) => {
      connections.forEach(conn => {
        if (conn !== connection) {
          conn.socket.send(message.toString());
        }
      });
    });

    connection.socket.on('close', () => {
      connections.delete(connection);
    });
  })
}

export default root;
