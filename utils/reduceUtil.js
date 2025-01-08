const getTotal = (array, keyOfObjToAccumulate) => {
  return array?.reduce((sum, item) => sum + item?.[keyOfObjToAccumulate], 0);
};

export { getTotal };
