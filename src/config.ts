export type Config = {
  port: number;
};

export default {
  port: process.env.PORT || 3000,
} as Config;
