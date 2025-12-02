import {
    createWard,
    getAllWards,
    getBedsByWard,
    assignBed,
    releaseBed
  } from "./ward.service.js";
  
  export const createWardController = async (req, res, next) => {
    try {
      const ward = await createWard({
        name: req.body.name,
        capacity: req.body.capacity,
        user: req.user.id
      });
  
      res.json({ message: "Ward created", ward });
    } catch (err) {
      next(err);
    }
  };
  
  export const getWardsController = async (req, res, next) => {
    try {
      res.json(await getAllWards());
    } catch (err) {
      next(err);
    }
  };
  
  export const getBedsByWardController = async (req, res, next) => {
    try {
      res.json(await getBedsByWard(req.params.wardId));
    } catch (err) {
      next(err);
    }
  };
  
  export const assignBedController = async (req, res, next) => {
    try {
      const bed = await assignBed({
        bedId: req.params.bedId,
        patient: req.body.patientId
      });
  
      res.json({ message: "Bed assigned", bed });
    } catch (err) {
      next(err);
    }
  };
  
  export const releaseBedController = async (req, res, next) => {
    try {
      const bed = await releaseBed(req.params.bedId);
      res.json({ message: "Bed released", bed });
    } catch (err) {
      next(err);
    }
  };
  