const API_PATH_LOGIN = '/login';

export const authPaths = { API_PATH_LOGIN };

const API_PATH_CHANGE_PASSWORD = '/change-password/:userId';

const API_PATH_GET_USER_BY_USERNAME = '/username/:username';

export const userPaths = {
  API_PATH_CHANGE_PASSWORD,
  API_PATH_GET_USER_BY_USERNAME,
};
