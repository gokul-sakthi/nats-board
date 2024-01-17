async function handleRequest<T>(
  request: Promise<T>
): Promise<{ error: unknown; result: T | null }> {
  try {
    const result = await request;
    return { error: null, result };
  } catch (error) {
    console.error("Request Error:", error);
    return { error, result: null };
  }
}

async function get<T>(
  url: string
): Promise<{ error: unknown; result: T | null }> {
  return handleRequest<T>(fetch(url).then((response) => response.json()));
}

async function post<T>(
  url: string,
  data: unknown
): Promise<{ error: unknown; result: T | null }> {
  return handleRequest<T>(
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => response.json())
  );
}

async function put<T>(
  url: string,
  data: unknown
): Promise<{ error: unknown; result: T | null }> {
  return handleRequest<T>(
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => response.json())
  );
}

async function del<T>(
  url: string
): Promise<{ error: unknown; result: T | null }> {
  return handleRequest<T>(
    fetch(url, { method: "DELETE" }).then((response) => response.json())
  );
}

export { get, post, put, del };
