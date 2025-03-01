import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventIDsByUser, getEventType } from '../Ctrl/EventosCtrl'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import './VisorDeCotizacionesStyles.css';
import { handleAcceso } from "../Util/AccessControl";

const VisorDeCotizaciones = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userID, setUserID] = useState(null);
    const [tiposEventos, setTiposEventos] = useState({});
    const navigate = useNavigate();

    useEffect(() => {

        
        const verificarAcceso = async () => {
            const acceso = await handleAcceso(2);
            // Si no hay acceso, se asume que handleAcceso redirige a /404
            if (!acceso) {
                return;
            }
        };
        verificarAcceso();

        // Obtener el userID del sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (currentUser && currentUser.idusuario) {
            setUserID(currentUser.idusuario);
        } else {
            setError("No se encontró la información del usuario actual.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userID) {
            const fetchEventos = async () => {
                try {
                    const data = await getEventIDsByUser(userID);

                    // Filtrar eventos que ya han pasado
                    const now = new Date();
                    const filteredData = data.filter(evento => {
                        const eventEndDateTime = new Date(`${evento.fecha}T${evento.hora_fin}`);
                        return eventEndDateTime > now;
                    });

                    // Ordenar eventos por fecha y hora de fin
                    const sortedData = filteredData.sort((a, b) => {
                        const aEndDateTime = new Date(`${a.fecha}T${a.hora_fin}`);
                        const bEndDateTime = new Date(`${b.fecha}T${b.hora_fin}`);
                        return aEndDateTime - bEndDateTime;
                    });

                    setEventos(sortedData);

                    // Extraer los id_tipo_evento y obtener sus nombres
                    const tiposEventosPromises = sortedData.map(evento => getEventType(evento.id_tipo_evento));
                    const tiposEventosNombres = await Promise.all(tiposEventosPromises);

                    // Crear un objeto con los nombres de los tipos de eventos
                    const tiposEventosMap = {};
                    sortedData.forEach((evento, index) => {
                        tiposEventosMap[evento.id_tipo_evento] = tiposEventosNombres[index];
                    });

                    setTiposEventos(tiposEventosMap);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchEventos();
        }
    }, [userID]);

    const handlePagoClick = (evento) => {
        if (evento.idevento) {
            navigate(`/app/ResumenPago/${evento.idevento}`);
        } else {
            console.error("El evento no tiene un ID válido.");
        }
    };

    if (loading) {
        return <p>Cargando eventos...</p>;
    }

    if (error) {
        return <p>El usuario no cuenta con ningun evento creado</p>;
    }

    const handleEditarClick = (evento) => {
        if (evento.idevento) {
            navigate(`/app/EdicionEventos/${evento.idevento}`);
        } else {
            console.error("El evento no tiene un ID válido.");
        }
    };

    return (
        <div className='container-visor'>
            <div className='container-visor-inner'>
                <h2 className='title'>Visor de Cotizaciones</h2>
                {eventos.length === 0 ? (
                    <p>No se encontraron eventos asociados al ID.</p>
                ) : (
                    <ul>
                        {eventos.map(evento => (
                            <li key={evento.idevento} className='evento-item'>
                                <div className='evento-header'>
                                    <span className='evento-id'>ID: {evento.idevento}</span>
                                    <span className='evento-estado'> {evento.estado}</span>
                                </div>
                                <div className='evento-body'>
                                    <div className='evento-row'>
                                        <div className='evento-col-left'>Fecha:</div>
                                        <div className='evento-col-right'>{evento.fecha}</div>
                                    </div>
                                    <div className='evento-row'>
                                        <div className='evento-col-left'>Hora de Inicio:</div>
                                        <div className='evento-col-right'>{evento.hora_inicio}</div>
                                    </div>
                                    <div className='evento-row'>
                                        <div className='evento-col-left'>Hora de Fin:</div>
                                        <div className='evento-col-right'>{evento.hora_fin}</div>
                                    </div>
                                    <div className='evento-row'>
                                        <div className='evento-col-left'>Tipo de Evento:</div>
                                        <div className='evento-col-right'>{tiposEventos[evento.id_tipo_evento]}</div>
                                    </div>
                                    <div className='evento-row'>
                                        <div className='evento-col-left'>Valor a pagar:</div>
                                        <div className='evento-col-right'>{evento.saldo_pendiente}</div>
                                    </div>
                                    {evento.estado === 'Aprobado' && (
                                        <>
                                            <button className='pago-button' onClick={() => handlePagoClick(evento)}>Realizar pago</button>
                                        </>
                                    )}
                                    {(evento.estado === 'En Cotizacion' || evento.estado === 'Aprobado') && (
                                        <>
                                            <button className='editar-button' onClick={() => handleEditarClick(evento)}>Editar</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default VisorDeCotizaciones;