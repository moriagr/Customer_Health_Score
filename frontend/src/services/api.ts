export async function fetchDashboardData(): Promise<any> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }, credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`There is a problem receiving data, please try again later.`);
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function fetchCustomers(): Promise<any> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // "Authorization": `Bearer ${yourToken}`, // if you need auth
      }, credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

export async function fetchCurrentCustomers(id: number): Promise<any> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/${id}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // "Authorization": `Bearer ${yourToken}`, // if you need auth
      }, credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
export async function saveEventDetails(body: object, id: number): Promise<any> {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/${id}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // "Authorization": `Bearer ${yourToken}`, // if you need auth
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

// export async function fetchCustomerDetail(id: number): Promise<CustomerDetail> {
//   const res = await fetch(`${API_BASE}/customers/${id}/health`);
//   return res.json();
// }
