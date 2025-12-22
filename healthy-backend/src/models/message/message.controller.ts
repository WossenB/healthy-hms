import { addMessage, getMessagesForModule } from "./message.service.js";
import { logActivity } from "../../utils/logActivity.js";

export const addMessageController = async (req, res, next) => {
  try {
    const { module, moduleId, content } = req.body;

    const message = await addMessage({
      author: req.user.id,
      authorRole: req.user.role,
      module,
      moduleId,
      content,
    });

    await logActivity({
      user: req.user,
      module,
      action: "add_note",
      description: `Added internal note to ${module}`,
      type: "light",
      before: null,
      after: message,
    });

    res.status(201).json({ message: "Note added", note: message });
  } catch (err) {
    next(err);
  }
};

export const getMessagesController = async (req, res, next) => {
  try {
    const { module, moduleId } = req.params;
    const messages = await getMessagesForModule(module, moduleId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
