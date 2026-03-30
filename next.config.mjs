/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/historico",
        destination: "/history",
        permanent: true
      },
      {
        source: "/metas",
        destination: "/goals",
        permanent: true
      },
      {
        source: "/caixas",
        destination: "/goals",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
