declare module 'react-native-config' {
  interface Env {
    NODE_ENV: 'development' | 'staging' | 'production';
    API_URL: 'http://51.15.71.195' | 'http://192.168.100.50:3000'
  }

  const Config: Env;

  export default Config;
}
