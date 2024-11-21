const College = require('../models/College');
const Branch = require('../models/Branch');

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find({})
      .select('-__v')
      .sort('ranking');
    res.json(colleges);
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Failed to retrieve colleges' });
  }
};

exports.getBranches = async (req, res) => {
  try {
    const { collegeId } = req.query;
    let query = Branch.find({});
    
    if (collegeId) {
      query = query.where('college').equals(collegeId);
    }
    
    const branches = await query
      .populate('college', 'name location')
      .select('-__v')
      .sort('name');
    
    res.json(branches);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({ error: 'Failed to retrieve branches' });
  }
};

exports.getBranchDetails = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branch = await Branch.findById(branchId)
      .populate('college', 'name location ranking')
      .select('-__v');
    
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    console.error('Get branch details error:', error);
    res.status(500).json({ error: 'Failed to retrieve branch details' });
  }
};
