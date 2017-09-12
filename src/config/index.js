export const IS_DEVELOP = process.env.NODE_ENV !== 'production';
export const API_URL = IS_DEVELOP ? 'http://localhost:3000' : 'https://liquid-api.herokuapp.com/';
