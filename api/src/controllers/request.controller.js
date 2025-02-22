import Request from '../models/request.model.js';

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('Id_Client');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  const request = new Request(req.body);
  try {
    const newRequest = await request.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};