/// <reference lib="webworker" />

// see: https://angular.io/guide/web-worker

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});
