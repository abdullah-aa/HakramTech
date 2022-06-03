const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.threads = functions.https.onRequest(async (_, response) => {
  functions.logger.info("Threads request", {structuredData: true});
  admin.database().ref('threads').on('value', snapshot => response.json(snapshot.val()));
});

exports.posts = functions.https.onRequest(async(request, response) => {
  const threadID = request.query.threadID;
  functions.logger.info(`Posts request for ${threadID}`, {structuredData: true});
  admin.database().ref('posts').orderByChild('threadID').equalTo(threadID).on('value', snapshot => response.json(snapshot.val()));
});

exports.createPost = functions.https.onRequest(async(request, response) => {
  const threadID = request.query.threadID;
  const postID = Math.random().toString().substring(2);
  functions.logger.info(`Post creation request for ${threadID}`, {structuredData: true});
  admin.database().ref(`posts/${postID}`).set({
    post: request.query.post,
    threadID: threadID,
    poster: request.query.poster || 'anonymous',
    createdAt: (new Date()).getTime(),
  });
  response.json({ result: `Post ID#${postID} created.`});
});

exports.createThread = functions.https.onRequest(async(request, response) => {
  const threadID = Math.random().toString().substring(2);
  functions.logger.info(`Thread creation request`, {structuredData: true});
  admin.database().ref(`threads/${threadID}`).set({
    title: request.query.title,
    threadID: threadID,
    author: request.query.author || 'anonymous',
    updatedAt: (new Date()).getTime(),
  });
  response.json({ result: `Thread ID#${threadID} created.`});
});

exports.updateThread = functions.database.ref('posts/{postID}').onCreate((snapshot, context) => {
  let post = snapshot.val();
  functions.logger.info(`Thread update request for ${post.threadID} - triggered by ${context.params.postID}`, {structuredData: true});
  return admin.database().ref(`threads/${post.threadID}`).update({ updatedAt: (new Date()).getTime() });
});