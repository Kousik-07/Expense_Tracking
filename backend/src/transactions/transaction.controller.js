import transectionData from "./transaction.model.js";

// createTransection;---------------------
export const createTransection = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.user;
        data.userId = id;

        const transaction =await new transectionData(data).save()
        res.json(transaction)
    } catch (error) {
        res.status(500).json({message:error.message || "Internal server problem"})
    }
}
// updateTransection;---------------------
export const updateTransection = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const transaction = await transectionData.findByIdAndUpdate(id, data, { new:true})
    res.json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Internal server problem" });
  }
};
// deleteTransection;----------------------------
export const deleteTransection = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transectionData.findByIdAndDelete(id);
        res.json(transaction)
    } catch (error) {
        res.status(500).json({message:error.message || "Internal server problem"})
    }
}
//getTransection;---------------------
export const getTransection = async (req, res) => {
    try {
        const { id } = req.user;
        const transaction = await transectionData.find({userId:id});
        res.json(transaction)
    } catch (error) {
        res.status(500).json({message:error.message || "Internal server problem"})
    }
}