// api.js
export const fetchDados = async (url: string) => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImM5OWRlODA1LTEzYTUtNDdlZC1hNDQwLTM5MmJmMDA3ZjY5ZiIsImV4cCI6MTcyMzU1ODM1N30.VqdEaZtV7SjI2UUCJ9IY4EYxXp0b5UBlcMAB0M3ZwG8";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar os dados");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    throw error;
  }
};
/*post*/
export const postDados = async (url: string, data: any) => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImM5OWRlODA1LTEzYTUtNDdlZC1hNDQwLTM5MmJmMDA3ZjY5ZiIsImV4cCI6MTcyMzU1ODM1N30.VqdEaZtV7SjI2UUCJ9IY4EYxXp0b5UBlcMAB0M3ZwG8";
  
    try {
      console.log("Posting data to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(token)
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error text:", errorText);
        throw new Error(`Erro ao postar os dados: ${response.status} - ${errorText}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Erro ao postar os dados:", error);
      throw error;
    }
  };