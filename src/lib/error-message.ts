import axios from "axios";

const RAW_STATUS_ERROR_PREFIX = "Request failed with status code";

export const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.message || error.response?.data?.error;

    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage;
    }

    if (error.code === "ERR_NETWORK") {
      return "Unable to connect to the server. Please try again.";
    }
  }

  if (error instanceof Error) {
    if (error.message.startsWith(RAW_STATUS_ERROR_PREFIX)) {
      return fallbackMessage;
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  return fallbackMessage;
};
