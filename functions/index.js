const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const MILLISECONDS_IN_HOUR = 3600000;
const randomizeDate = hoursToRemove => {
  let now = new Date();
  let timeToRemove = Math.floor(Math.random() * (hoursToRemove * MILLISECONDS_IN_HOUR));
  now.setTime(now.getTime() - timeToRemove);
  return now.getTime();
}

exports.threads = functions.https.onRequest(async (_, response) => {
  functions.logger.info("Threads request", {structuredData: true});

  admin.database().ref('threads').once('value', snapshot => response.json(snapshot.val()));
});

exports.posts = functions.https.onRequest(async(request, response) => {
  const threadID = request.query.threadID;

  functions.logger.info(`Posts request for ${threadID}`, {structuredData: true});
  
  admin.database().ref('posts').orderByChild('threadID').equalTo(threadID).once('value', snapshot => response.json(snapshot.val()));
});

exports.createPost = functions.https.onRequest(async(request, response) => {
  const threadID = request.query.threadID;
  const postID = Math.random().toString().substring(2);
  const timestamp = randomizeDate(0.25);

  functions.logger.info(`Post creation request for ${threadID}`, {structuredData: true});
  
  admin.database().ref(`posts/${postID}`).set({
    post: request.query.post,
    threadID: threadID,
    poster: request.query.poster || 'anonymous',
    createdAt: timestamp,
  });

  response.json({ id: postID });
});

exports.createThread = functions.https.onRequest(async(request, response) => {
  const threadID = Math.random().toString().substring(2);
  const timestamp = randomizeDate(3) - MILLISECONDS_IN_HOUR; // Always at least an hour before endpoint invokation, maybe earlier.

  functions.logger.info(`Thread creation request`, {structuredData: true});
  
  admin.database().ref(`threads/${threadID}`).set({
    title: request.query.title,
    id: threadID,
    author: request.query.author || 'anonymous',
    updatedAt: timestamp,
    createdAt: timestamp
  });

  response.json({ id: threadID });
});

exports.updateThread = functions.database.ref('posts/{postID}').onCreate((snapshot, context) => {
  let post = snapshot.val();

  functions.logger.info(`Thread update request for ${post.threadID} - triggered by ${context.params.postID}`, {structuredData: true});
  
  return admin.database().ref(`threads/${post.threadID}`).update({ updatedAt: post.createdAt });
}); 