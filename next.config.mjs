const nextConfig = {
  experimental: {
    // The course app lives in /private and is read from disk by app/portal/course-app, so include it in the build output.
    outputFileTracingIncludes: { "/portal/course-app/[...path]": ["./private/**/*"] },
  },
};
export default nextConfig;
