import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
    if (res.socket.server.io) {
        console.log('Socket already running');
    } else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            // Broadcast user count updates
            const updateUsers = () => {
                io.emit('users', Array.from(io.sockets.sockets.keys()));
            };

            socket.on('drawing', (path) => {
                socket.broadcast.emit('drawing', path);
            });

            socket.on('signal', ({ userId, signal }) => {
                io.to(userId).emit('signal', {
                    userId: socket.id,
                    signal
                });
            });

            socket.on('disconnect', () => {
                updateUsers();
            });

            updateUsers();
        });
    }
    res.end();
}
