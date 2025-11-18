import {
  createLabRequest,
  getAllLabRequests,
  getLabRequestById,
  updateLabRequest,
  deleteLabRequest,
} from "./lab.service";

export const createLabRequestController = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      requestedBy: req.user.id,
    };

    const labRequest = await createLabRequest(data);

    res.status(201).json({
      message: "Lab request created successfully",
      labRequest,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllLabRequestsController = async (req, res, next) => {
  try {
    const labRequests = await getAllLabRequests(req.query);
    res.status(200).json(labRequests);
  } catch (err) {
    next(err);
  }
};

export const getLabRequestByIdController = async (req, res, next) => {
  try {
    const labRequest = await getLabRequestById(req.params.id);

    if (!labRequest) {
      return res.status(404).json({ message: "Lab request not found" });
    }

    res.status(200).json(labRequest);
  } catch (err) {
    next(err);
  }
};

export const updateLabRequestController = async (req, res, next) => {
  try {
    const updated = await updateLabRequest(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Lab request not found" });
    }

    res.status(200).json({
      message: "Lab request updated successfully",
      labRequest: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLabRequestController = async (req, res, next) => {
  try {
    const deleted = await deleteLabRequest(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Lab request not found" });
    }

    res.status(200).json({ message: "Lab request deleted successfully" });
  } catch (err) {
    next(err);
  }
};
