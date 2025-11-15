const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function postData<T>(
  endpoint: string,
  data: object
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}

export async function putData<T>(
  endpoint: string,
  data: object
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
