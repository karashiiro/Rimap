module.exports = async (client, logger, oldMessage, newMessage) => {
	client.emit('message', newMessage);
}