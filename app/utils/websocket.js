export const webSocket = (io, prisma) => {
    const users = {};

    io.on('connection', (socket) => {
        console.log('New WebSocket connection');

        socket.on('join', async ({ userId, roomId }) => {
            try {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    users[socket.id] = { userId, roomId, username: user.username };
                    socket.join(roomId);
                    socket.to(roomId).emit('message', { text: `${user.username} has joined the chat!` });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('error', 'Failed to join room');
            }
        });

        socket.on('sendMessage', async (message) => {
            try {
                const { userId, roomId, text } = message;
                const user = users[socket.id];
                if (user) {
                    const newMessage = await prisma.message.create({
                        data: {
                            text,
                            userId,
                            roomId
                        }
                    });
                    io.to(roomId).emit('message', { user: user.username, text: newMessage.text });
                }
            } catch (error) {
                console.error('Error sending message:', error);

            }
        });

        socket.on('disconnect', () => {
            const user = users[socket.id];
            if (user) {
                io.to(user.roomId).emit('message', { text: `${user.username} has left.` });
                delete users[socket.id];
            }
        });
    });
};
