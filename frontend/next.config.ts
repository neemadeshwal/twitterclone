import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"], // Add your allowed domains here
  },
};

export default nextConfig;
