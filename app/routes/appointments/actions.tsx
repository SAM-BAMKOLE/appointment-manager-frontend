import axiosInstance from "~/utils/axios";
import type { Route } from "../+types/home";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
    const method = request.method;
    let formData = await request.formData();

    switch (method) {
        case "PATCH":
            try {
                const { id, status } = Object.fromEntries(formData);
                // console.log({ id, status });
                const response = await axiosInstance.patch(`appointments/${id}`, { status });
                return { success: response.data.success };
            } catch (error: any) {
                console.log(error);
            }
            break;
        case "DELETE":
            try {
                const { id } = Object.fromEntries(formData);
                const response = await axiosInstance.delete(`appointments/${id}`);
                return { success: response.data.success };
            } catch (error: any) {
                console.log(error);
            }
            break;
        case "POST":
            try {
                const data = Object.fromEntries<any>(formData);

                data.duration = Number.parseInt(data.duration);
                const response = await axiosInstance.post("/appointments", data);
                return { success: response.data.success };
            } catch (error) {
                console.log(error);
            }
            break;
    }
}
