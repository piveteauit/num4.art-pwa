export const logger = {
  s3: {
    info: (message: string, data?: any) => {
      console.log(`[S3] 📦 ${message}`, data ? data : "");
    },
    error: (message: string, error?: any) => {
      console.error(`[S3] ❌ ${message}`, error ? error : "");
    },
    warn: (message: string, data?: any) => {
      console.warn(`[S3] ⚠️ ${message}`, data ? data : "");
    }
  }
};
