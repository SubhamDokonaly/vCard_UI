import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        { url: URL + "user/login", method: "POST", returnFullPayload: true },
        { data: [data] }
      ),
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        { url: URL + "user/register", method: "POST", returnFullPayload: true },
        { data: [data] }
      ),
  });
};

export const useGetUnverifiedUser = (id) => {
  return useQuery({
    queryKey: ["unverifiedUser", id],
    queryFn: ({ queryKey: [, id] }) =>
      fetchData(
        {
          url: URL + "user/getUserMailbyId",
          method: "POST",
          isAuthRequired: true,
          parseJson: false,
        },
        { data: [{ id }] }
      ),
    enabled: !!id,
  });
};

export const useUpdateUnverifiedUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        { url: URL + "user/userUpdate", method: "POST" },
        { data: [data] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unverifiedUser"] });
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        { url: URL + "user/verifyOtp", method: "POST" },
        { data: [data] }
      ),
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        { url: URL + "user/resendOtp", method: "POST" },
        { data: [data] }
      ),
  });
};

export const useGetUserData = (id) => {
  const userId = localStorage.getItem("allMasterId") ?? id;
  return useQuery({
    queryKey: ["userData", userId],
    queryFn: ({ queryKey: [, userId] }) =>
      fetchData(
        {
          url:
            id != null
              ? URL + "public/user/getUserDetailsById"
              : URL + "user/getUserDetailsById",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [{ id: userId }] }
      ),
    enabled: !!userId,
  });
};

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/updateUserDetails",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["userList"],
    queryFn: () =>
      fetchData({
        url: URL + "user/getList",
        isAuthRequired: true,
      }),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/addUser",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/updateStatusById",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
};

export const useSendForgetPasswordRequest = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/forgotpasswordmail",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/changeForgotPassword",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
  });
};
