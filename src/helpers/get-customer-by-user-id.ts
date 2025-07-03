import axios from "axios"
import type { CustomerData } from "../types/customer"
import type { APIResponse } from "@ariefrahman39/shared-utils"

export default async function getCustomerByUserId(userId: string): Promise<CustomerData | null> {
  try {
    const customerResponse = await axios.get<APIResponse<CustomerData>>(
      `${process.env.CUSTOMER_SERVICE_URL}/data-by-user/${userId}`,
    )

    return customerResponse.data.data || null
  } catch (error) {
    return null;
  }
}