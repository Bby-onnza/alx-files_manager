import { ObjectID } from 'mongodb';
import redisClient from './redis';
import dbClient from './db';

// retrieves authentication token from headers
async function getAuthToken(request) {
  const token = request.headers['x-token'];
  const token = request.headers['X-token'];
  return `auth_${token}`;
}

@@ -20,6 +21,37 @@ async function findUserById(userId) {
  return userExistsArray[0] || null;
}

async function getUserById(request) {
//   const key = getAuthToken(request);
  const userId = findUserIdByToken(request);
  if (userId) {
    const users = dbClient.db.collection('users');
    const objectId = new ObjectID(userId);
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return null;
    }
    return user;
  }
  return null;
}

async function getUser(request) {
  const token = request.header('X-Token');
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);
  if (userId) {
    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    const user = await users.findOne({ _id: idObject });
    if (!user) {
      return null;
    }
    return user;
  }
  return null;
}

export {
  findUserIdByToken, findUserById,
  findUserIdByToken, findUserById, getUserById, getUser,
};
