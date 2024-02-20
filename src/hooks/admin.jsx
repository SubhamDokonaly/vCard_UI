import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { fetchData } from "../helper";

export const insertProduct = async (data) => {
    console.log(data)
    let token = localStorage.getItem("token");
    try {
        const response = await fetch(URL + "admin/insertProduct", {
            method: "POST",
            body: data,
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        if (response.status === 401) {
            toast.error("Unauthorized");
            throw new Error("Unauthorized Access");
        }
        const responseJson = await response.json();
        if (responseJson.status === 0) {
            toast.error(responseJson.message);
            throw new Error(responseJson.response);
        }
        return responseJson;
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
};


export const updateProduct = async (data) => {
    console.log(data)
    let token = localStorage.getItem("token");
    try {
        const response = await fetch(URL + "admin/updateProductById", {
            method: "POST",
            body: data,
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        if (response.status === 401) {
            toast.error("Unauthorized");
            throw new Error("Unauthorized Access");
        }
        const responseJson = await response.json();
        if (responseJson.status === 0) {
            toast.error(responseJson.message);
            throw new Error(responseJson.response);
        }
        return responseJson;
    } catch (error) {
        toast.error(error.message);
        throw new Error(error.message);
    }
};


export const useAddProduct = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
     insertProduct(data),
    onSuccess: () => {
        onSuccess()
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
    },
  });
};


export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data) =>
      updateProduct(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["productsList"] });
      },
    });
  };



export const useGetAllProducts = () => {
    return useQuery({
      queryKey: ["productsList"],
      queryFn: () =>
        fetchData({
          url: URL + "admin/getAllProduct",
          isAuthRequired: true,
        }),
    });
  };




