import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/Inscripcion.css";
import inscripcionActividad from "../services/ActividadesBecario/inscripcionActividadAPI";
import { toast } from 'sonner';
import { activityInscriptionPropTypes } from "../util/propTypes";
import { fetchPersonById } from '../services/PerfilBecario/personAPI';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';

const FormularioInscripcion = ({ actividad, onClose }) => {
    const { refreshActInscritas } = useDashboard();
    const { getUser } = useAuth();
    const [persona, setPersona] = useState(null);
    let user = getUser();

    const getData = async () => {
        const persona_id = user.persona_id;

        try {
            const result = await fetchPersonById({ person_id: persona_id });
            const personData = result.body;

            if (result.state) {
                setPersona(personData);
            }
        } catch (error) {
            console.error('Error al obtener los datos de la persona:', error);
        }        
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await inscripcionActividad({ actividadId: actividad.actividad_id, noCuenta: user.no_cuenta });

        if (response.state) {
            toast.success(`${response.body}`);
            onClose();
            refreshActInscritas();
        } else {
            toast.info(`${response.body}`);
        }
    };

    return (
        <div className="formulario-inscripcion">
            <div className="formulario-header d-flex align-items-center gap-3">
                <img
                    src={actividad.imagen}
                    alt={actividad.nombre_actividad}
                    style={{ width: "95px", height: "95px", margin: "12px" }}
                />
                <h2 className="mb-0">Inscripción en {actividad.nombre_actividad}</h2>
            </div>
            <Form onSubmit={handleSubmit} className="form-main">
                <Form.Group controlId="nombre">
                    <Form.Label>1. Nombre(s)</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        defaultValue={persona ? `${persona.primer_nombre} ${persona.segundo_nombre}` : ''}
                        readOnly={!!persona}
                    />
                </Form.Group>
                <Form.Group controlId="apellido">
                    <Form.Label>2. Apellido(s)</Form.Label>
                    <Form.Control
                        type="text"
                        name="apellido"
                        defaultValue={persona ? `${persona.primer_apellido} ${persona.segundo_apellido}` : ''}
                        readOnly={!!persona}
                    />
                </Form.Group>
                <Form.Group controlId="cuenta">
                    <Form.Label>3. Número de Cuenta de la UNAH</Form.Label>
                    <Form.Control
                        type="text"
                        name="cuenta"
                        defaultValue={user ? user.no_cuenta : ''}
                        readOnly={!!user}
                    />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>4. Correo electrónico de la UNAH</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        defaultValue={persona ? persona.correo_institucional : ''}
                        readOnly={!!persona}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-20 boton-guardar">
                    Inscribirse
                </Button>
                <Button type="button" variant="secondary" className="w-20 boton-cancelar" onClick={onClose}>Volver</Button>
            </Form>
        </div>
    );
};

FormularioInscripcion.propTypes = activityInscriptionPropTypes;
export default FormularioInscripcion;
