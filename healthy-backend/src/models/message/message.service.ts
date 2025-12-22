import Message from "./message.model.js";

export const addMessage = async (data) => {
  return await Message.create(data);
};

export const getMessagesForModule = async (module, moduleId) => {
  return Message.find({ module, moduleId })
    .populate("author", "name email role")
    .sort({ createdAt: 1 });
};
