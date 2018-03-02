const conditionalRoutePush = (router, newPath) => {
  if (router.getCurrentLocation().pathname !== newPath) {
    router.push(newPath);
  }
};

export default conditionalRoutePush;
