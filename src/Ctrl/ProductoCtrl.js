import { supabase } from "../API/SupabaseAPI";

export const getAllProducto = async () => {
  try {
    const { data, error } = await supabase.from("producto").select("*");

    // console.log("Productos obtenidos:", data);
    if (error) {
      console.error("Error obteniendo todos los productos:", error);
      throw new Error("No se pudo obtener los productos");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo verificar los productos");
  }
};