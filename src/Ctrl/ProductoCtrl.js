import { supabase } from "../API/SupabaseAPI";
import { deleteFotoProducto } from "../API/StorageAPI";

// Obtiene todos los productos
export const getAllProducto = async () => {
  try {
    const { data, error } = await supabase.from("producto").select("*");
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

// Obtiene un producto por su ID
export const getProductoByID = async (id) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .select("*")
      .eq("idproducto", id)
      .single();
    if (error) {
      console.error("Error obteniendo el producto por ID:", error);
      throw new Error("No se pudo obtener el producto");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo obtener el producto");
  }
};

// Busca productos cuyo nombre contenga el substring especificado (búsqueda insensible a mayúsculas/minúsculas)
export const getProductosByNombre = async (nombre) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .select("*")
      .ilike("nombre", `%${nombre}%`);
    if (error) {
      console.error("Error obteniendo productos por nombre:", error);
      throw new Error("No se pudieron obtener los productos");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo obtener los productos");
  }
};

// Actualiza un producto dado su ID y la información a modificar
export const updateProducto = async (id, producto) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .update(producto)
      .eq("idproducto", id);
    if (error) {
      console.error("Error actualizando el producto:", error);
      throw new Error("No se pudo actualizar el producto");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo actualizar el producto");
  }
};

// Elimina un producto por su ID
export const deleteProducto = async (id) => {
  try {
    const { data, error } = await supabase
      .from("producto")
      .delete()
      .eq("idproducto", id);
    const { imageData, imageError } = await deleteFotoProducto(id);
    if (error) {
      console.error("Error eliminando el producto:", error);
      throw new Error("No se pudo eliminar el producto");
    }
    if (imageError) {
      console.error("Error eliminando la imagen asociada al producto:", error);
      throw new Error("No se pudo eliminar la imagen asociada al producto");
    }
    return data;
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo eliminar el producto");
  }
};

// Crea un nuevo producto
export const createProducto = async (producto) => {
  try {
    // Se inserta el producto y se devuelve el producto creado
    const { data, error } = await supabase
      .from("producto")
      .insert([producto])
      .select();
    if (error) {
      console.error("Error creando el producto:", error);
      throw new Error("No se pudo crear el producto");
    }
    // data es un array, se retorna el primer elemento
    return data[0];
  } catch (error) {
    console.error("Error interno:", error);
    throw new Error("FATAL ERROR: No se pudo crear el producto");
  }
};
