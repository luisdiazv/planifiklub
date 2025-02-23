// src/context/ClubInfoContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getActualLogoClub } from "../API/StorageAPI";
import { getActualNombreClubInfo, getActualDescripcionClubInfo } from "../Ctrl/InformacionClubCtrl";
import { supabase } from "../API/SupabaseAPI";

const ClubInfoContext = createContext();

export const useClubInfo = () => useContext(ClubInfoContext);

export const ClubInfoProvider = ({ children }) => {
  const [logo, setLogo] = useState(null);
  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");

  // Cargar datos iniciales: primero desde localStorage y luego actualizarlos con la API
  const loadInitialData = async () => {
    // Intentar cargar desde localStorage
    const storedLogo = localStorage.getItem("clubLogo");
    const storedClubName = localStorage.getItem("clubName");
    const storedClubDesc = localStorage.getItem("clubDesc");
    if (storedLogo) setLogo(storedLogo);
    if (storedClubName) setClubName(storedClubName);
    if (storedClubDesc) setClubName(storedClubDesc);

    // Obtener datos actualizados desde la API
    try {
      const logoUrl = await getActualLogoClub();
      const name = await getActualNombreClubInfo();
      const descripcion = await getActualDescripcionClubInfo();
      setLogo(logoUrl);
      setClubName(name);
      setClubDesc(descripcion)
      localStorage.setItem("clubLogo", logoUrl);
      localStorage.setItem("clubName", name);
      localStorage.setItem("clubDesc", descripcion);
    } catch (error) {
      console.error("Error al cargar la info del club:", error.message);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Configurar la suscripción en tiempo real con Supabase (v2)
    const channel = supabase.channel("club-info-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "informacion_club",
        },
        (payload) => {
          console.log("Actualización recibida:", payload);
          if (payload.new.logo) {
            setLogo(payload.new.logo);
            localStorage.setItem("clubLogo", payload.new.logo);
          }
          if (payload.new.nombre) {
            setClubName(payload.new.nombre);
            localStorage.setItem("clubName", payload.new.nombre);
          }
          if (payload.new.nombre) {
            setClubName(payload.new.descripcion);
            localStorage.setItem("clubDesc", payload.new.descripcion);
          }
        }
      )
      .subscribe();

    // Limpieza de la suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ClubInfoContext.Provider value={{ logo, clubName, clubDesc}}>
      {children}
    </ClubInfoContext.Provider>
  );
};

export { ClubInfoContext };
