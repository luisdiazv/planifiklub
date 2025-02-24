import { getActualColorList, updateActualColors } from "../Ctrl/InformacionClubCtrl";

let colorsInstance = await getActualColorList();

export function getColors() {
  return colorsInstance;
}

export function setColors(newColors) {
  if (!Array.isArray(newColors)) {
    throw new Error("El argumento debe ser un arreglo.");
  }
  if (newColors.length !== colorsInstance.length) {
    throw new Error(`El arreglo debe tener ${colorsInstance.length} elementos.`);
  }
  colorsInstance = newColors;
  updateActualColors(newColors);
}
