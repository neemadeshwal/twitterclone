import { followUser } from "@/graphql/mutation/follows";
import {
  checkLoginPassword,
  confirmYou,
  createAccount,
  editProfileMutate,
  getCredAndSendOtp,
  getLoginCreds,
  resetPassword,
  verifyOtp,
} from "@/graphql/mutation/user";
import {
  checkLoginPassProps,
  createAccountProps,
  editProfileProps,
  followUserProps,
  getCredsData,
  getLoginCredsProps,
  verifyOtpProps,
} from "@/graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define the response type for the credential and OTP
interface CredResponse {
  getCredAndSendOtp: {
    next_page: string;
    email: string;
  };
}

interface OtpResponse {
  verifyOtp: {
    next_page: string;
    email: string;
  };
}

interface createAccountResponse {
  createAccount: {
    next_page: string;
    email: string;
  };
}

interface checkEmailResponse {
  getLoginCreds: {
    next_page: string;
    email: string;
  };
}

interface verifyPassResponse {
  checkLoginPassword: {
    next_page: string;
    email: string;
  };
}

interface confirmYouResponse {
  confirmedMail: {
    next_page: string;
    email: string;
  };
}

interface NewPassResponse {
  resetPassword: {
    next_page: string;
    email: string;
  };
}

interface UseUserMutationProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const userUserMutation = ({
  onSuccess,
  onError,
}: UseUserMutationProps = {}) => {
  const queryClient = useQueryClient();

  // Type assertion for your mutation function
  const typedGetCredAndSendOtp = (
    data: getCredsData
  ): Promise<CredResponse> => {
    return getCredAndSendOtp(data) as Promise<CredResponse>;
  };
  const typedVerifyOtp = (data: verifyOtpProps): Promise<OtpResponse> => {
    return verifyOtp(data) as Promise<OtpResponse>;
  };

  const typedCreateAccount = (
    data: createAccountProps
  ): Promise<createAccountResponse> => {
    return createAccount(data) as Promise<createAccountResponse>;
  };

  const typedCheckEmail = (
    data: getLoginCredsProps
  ): Promise<checkEmailResponse> => {
    return getLoginCreds(data) as Promise<checkEmailResponse>;
  };

  const typedVerifyPass = (
    data: checkLoginPassProps
  ): Promise<verifyPassResponse> => {
    return checkLoginPassword(data) as Promise<verifyPassResponse>;
  };

  const typedConfirmYou = (data: {
    email: string;
  }): Promise<confirmYouResponse> => {
    return confirmYou(data) as Promise<confirmYouResponse>;
  };

  const typedNewPass = (data: {
    email: string;
    password: string;
  }): Promise<NewPassResponse> => {
    return resetPassword(data) as Promise<NewPassResponse>;
  };

  const getCredAndSendOtpMutation = useMutation<
    CredResponse,
    Error,
    getCredsData
  >({
    mutationFn: typedGetCredAndSendOtp,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const verifyOtpMutation = useMutation<OtpResponse, Error, verifyOtpProps>({
    mutationFn: typedVerifyOtp,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const createAccountMutation = useMutation<
    createAccountResponse,
    Error,
    createAccountProps
  >({
    mutationFn: typedCreateAccount,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const checkEmailMutation = useMutation<
    checkEmailResponse,
    Error,
    getLoginCredsProps
  >({
    mutationFn: typedCheckEmail,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const verifyPassMutation = useMutation<
    verifyPassResponse,
    Error,
    checkLoginPassProps
  >({
    mutationFn: typedVerifyPass,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const confirmMailMutation = useMutation<
    confirmYouResponse,
    Error,
    { email: string }
  >({
    mutationFn: typedConfirmYou,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const newPasswordMutation = useMutation<
    NewPassResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: typedNewPass,
    onSuccess: (data) => {
      onSuccess?.();
      return data;
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const EditUserMutation = useMutation({
    mutationFn: (body: editProfileProps) => editProfileMutate(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });

  const followUserMutation = useMutation({
    mutationFn: (body: followUserProps) => followUser(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });

      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });

  const getCredAndSendOtpFn = async (body: getCredsData) => {
    try {
      const result = await getCredAndSendOtpMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const verifyOtpFn = async (body: verifyOtpProps) => {
    try {
      const result = await verifyOtpMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const createAccountFn = async (body: createAccountProps) => {
    try {
      const result = await createAccountMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const checkEmailFn = async (body: getLoginCredsProps) => {
    try {
      const result = await checkEmailMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const verifyPassFn = async (body: checkLoginPassProps) => {
    try {
      const result = await verifyPassMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const confirmMailFn = async (body: { email: string }) => {
    try {
      const result = await confirmMailMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const newPassFn = async (body: { email: string; password: string }) => {
    try {
      const result = await newPasswordMutation.mutateAsync(body);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const editUser = async (body: editProfileProps) => {
    try {
      await EditUserMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const followUserFn = async (body: followUserProps) => {
    try {
      await followUserMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    editUser,
    getCredAndSendOtpFn,
    createAccountFn,
    verifyOtpFn,
    checkEmailFn,
    verifyPassFn,
    newPassFn,
    confirmMailFn,
    followUserFn,
    isgettingCred: getCredAndSendOtpMutation.isPending,
    isEditingUser: EditUserMutation.isPending,
  };
};
