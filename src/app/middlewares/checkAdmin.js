import User from '../models/User';

export default async (req, res, next) => {
  const checkUserAdmin = await User.findOne({
    where: { id: req.userId, is_admin: true }
  });
  if (!checkUserAdmin) {
    return res.status(401).json({ error: 'User is not a admin' });
  }
  return next();
};
