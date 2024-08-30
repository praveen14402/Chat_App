/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1123456788,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"kbjdsbkjsbfvksbkjbkjabfkasf",
  },
  images:{
    domains:["localhost"]
  }
};

module.exports = nextConfig;
