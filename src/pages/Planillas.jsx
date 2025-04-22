import { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { FaDownload, FaPlusCircle, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import useGenerarPDF from "../hooks/useGenerarPDF";
import '../styles/Planillas.css';
import Modal from "../components/Modal";
import useCentrosEstudio from "../hooks/useCentrosEstudio";
import crearPlanilla from "../services/Planilla/Administracion/CrearPlanilla";
import { useDashboard } from '../context/DashboardContext';
import { informacionplanilla_byId } from "../services/Planilla/Administracion/informacionplanilla_byId";
import { handleEliminarPlanilla } from "../services/Planilla/Administracion/EliminarPlanilllas/handleEliminarPlanila";

const PlanillasPagoBecarios = () => {
  const [planillas, setPlanillas] = useState([]);
  const [planillaNueva, setPlanillaNueva] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const generarPDF = useGenerarPDF();

  const { refreshPlanillatadmin, refreshPlanilla, dataFetch } = useDashboard();

  const [formData, setFormData] = useState({
    mes: "Junio",
    anio: new Date().getFullYear(),
    centro_estudio_id: 1
  });

  const { centrosEstudio, loading, error } = useCentrosEstudio();

  const obtenerAniosDisponibles = () => {
    const anioActual = new Date().getFullYear();
    const anioMinimo = anioActual - 1;
    const anioMaximo = anioActual + 3;
    return Array.from({ length: anioMaximo - anioMinimo + 1 }, (_, index) => anioMinimo + index);
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setPlanillas(dataFetch?.planilla?.data || []);
      } catch (error) {
        console.error("Error al obtener planillas:", error);
        toast.error("Error al cargar las planillas");
      }
    };

    obtenerDatos();
  }, [dataFetch]);

  const cancelGenerate = () => {
    setPlanillaNueva(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "anio") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else if (name === "centro_estudio_id") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const confirmarCreacionPlanilla = async () => {
    if (confirmando) return;

    setConfirmando(true);

    toast.custom((t) => (
      <div className="p-3 bg-white rounded shadow" style={{ width: '350px', zIndex: 10000 }}>
        <h5 className="mb-3">Confirmar creación</h5>
        <p>¿Estás seguro que deseas crear la planilla para {formData.mes} {formData.anio}?</p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              toast.dismiss(t);
              setConfirmando(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              toast.dismiss(t);
              generarNuevaPlanilla();
              setConfirmando(false);
            }}
          >
            Confirmar
          </Button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'center-center'
    });
  };

  const generarNuevaPlanilla = async () => {
    const { mes, anio, centro_estudio_id } = formData;

    try {
      const response = await crearPlanilla(mes, anio, centro_estudio_id);

      if (response.success) {
        refreshPlanillatadmin();
        refreshPlanilla();
        toast.success("Planilla creada exitosamente");
        setPlanillaNueva(false);
      } else {
        toast.error(`Error al crear planilla: ${response.errorMessage}`);
      }
    } catch (error) {
      toast.error("Error crítico al crear la planilla");
      console.error("Error al crear la planilla:", error);
    }
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDescargarPDF = async (planilla) => {
    try {
      const response = await informacionplanilla_byId({ planilla_id: planilla.planilla_id });

      if (response.state) {
        generarPDF(response.body); // Pasamos solo el cuerpo de la respuesta
        toast.success("Generando PDF...");
      } else {
        toast.error("Error al cargar los becarios de la planilla");
      }
    } catch (error) {
      toast.error("Error al generar el PDF");
      console.error("Error al generar PDF:", error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 planillas-container">
        <h1>Planillas de pago corrientes</h1>
        <Button
          variant="primary"
          onClick={() => setPlanillaNueva(true)}
        >
          <FaPlusCircle className="me-2" /> Nueva Planilla
        </Button>
      </div>

      {!planillas || planillas.length === 0 ? (
        <p className="text-muted">No hay planillas registradas en el año actual.</p>
      ) : (
        <Row>
          {planillas.map((planilla, index) => {
            const backgroundColor = index % 2 === 0 ? '#F4F4F9' : '#E6EBE0';
            return (
              <Col md={6} lg={4} key={planilla.planilla_id} className="mb-4">
                <Card style={{ border: 'none', backgroundColor }}>
                  <Card.Body>
                    <Card.Text className="titulo">{planilla.descripcionPlanilla}</Card.Text>
                    <Card.Text className="text-muted">
                      Planilla de pago correspondiente para el mes de {planilla.mes} del año {planilla.anio}
                    </Card.Text>
                    <Card.Text className="centro-estudio">
                      Centro de Estudio: {planilla.nombre_centro_estudio}
                    </Card.Text>
                    <Card.Text className="generada-por">
                      Generada por {planilla.NombreCompleto}
                    </Card.Text>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDescargarPDF(planilla)}
                      >
                        <FaDownload className="me-2" /> Descargar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleEliminarPlanilla(planilla.planilla_id, refreshPlanillatadmin, refreshPlanilla)}
                      >
                        <FaTrash className="me-2" /> Eliminar
                      </Button>
                      <div className="d-flex align-items-center text-muted planilla-info">
                        <div className="icon-left"><FaCalendarAlt /> {formatearFecha(planilla.fecha_planilla_creacion)}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {planillaNueva && (
        <Modal
          isOpen={planillaNueva}
          title="Generar Nueva Planilla"
          onConfirm={confirmarCreacionPlanilla}
          onCancel={cancelGenerate}
        >
          <Form>
            <Form.Group controlId="formMes">
              <Form.Label style={{ color: 'var(--fourth-text-color)', fontWeight: 'bold' }}>Mes</Form.Label>
              <Form.Control
                as="select"
                name="mes"
                value={formData.mes}
                onChange={handleInputChange}
              >
                <option value="Enero">Enero</option>
                <option value="Febrero">Febrero</option>
                <option value="Marzo">Marzo</option>
                <option value="Abril">Abril</option>
                <option value="Mayo">Mayo</option>
                <option value="Junio">Junio</option>
                <option value="Julio">Julio</option>
                <option value="Agosto">Agosto</option>
                <option value="Septiembre">Septiembre</option>
                <option value="Octubre">Octubre</option>
                <option value="Noviembre">Noviembre</option>
                <option value="Diciembre">Diciembre</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formAnio">
              <Form.Label style={{ color: 'var(--fourth-text-color)', fontWeight: 'bold' }}>Año</Form.Label>
              <Form.Control
                as="select"
                name="anio"
                value={formData.anio}
                onChange={handleInputChange}
              >
                {obtenerAniosDisponibles().map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCentroEstudio">
              <Form.Label style={{ color: 'var(--fourth-text-color)', fontWeight: 'bold' }}>Centro de Estudio</Form.Label>
              <Form.Control
                as="select"
                name="centro_estudio_id"
                value={formData.centro_estudio_id}
                onChange={handleInputChange}
              >
                {loading && <option>Cargando...</option>}
                {error && <option>Error al cargar centros de estudio</option>}
                {!loading && !error && centrosEstudio.map(centro => (
                  <option key={centro.centro_estudio_id} value={centro.centro_estudio_id}>
                    {centro.nombre_centro_estudio}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal>
      )}
    </Container>
  );
};

export default PlanillasPagoBecarios;